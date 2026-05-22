import { CodeType, PrismaClient } from "@db/client";
import env from "@config/env";
import resend from "@config/resend";

const SITE_NAME = "meetjeffolsen.com";

type CodeCounts = Partial<Record<CodeType, number>>;

interface ReportData {
  period: { from: Date; to: Date };
  registrations: number;
  activeAccounts: number;
  verifiedEmails: number;
  deletedAccounts: number;
  codesSent: number;
  codesByType: CodeCounts;
  codesUsed: number;
  codesExpiredUnused: number;
}

async function gatherReportData(prisma: PrismaClient): Promise<ReportData> {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    registrations,
    activeAccounts,
    verifiedEmails,
    deletedAccounts,
    allCodes,
  ] = await Promise.all([
    prisma.profileReceipt.count({
      where: {
        createdAt: { gte: oneWeekAgo },
        profile: { email: { not: env.ADMIN_USER } },
      },
    }),
    prisma.profileReceipt.count({
      where: {
        deletedAt: null,
        profile: { email: { not: env.ADMIN_USER } },
      },
    }),
    prisma.profileReceipt.count({
      where: {
        deletedAt: null,
        verifiedEmailAt: { not: null },
        profile: { email: { not: env.ADMIN_USER } },
      },
    }),
    prisma.profileReceipt.count({
      where: {
        deletedAt: { gte: oneWeekAgo },
      },
    }),
    prisma.verificationCode.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      select: { type: true, usedAt: true, expiredAt: true },
    }),
  ]);

  const codesByType: CodeCounts = {};
  let codesUsed = 0;
  let codesExpiredUnused = 0;

  for (const code of allCodes) {
    codesByType[code.type] = (codesByType[code.type] ?? 0) + 1;
    if (code.usedAt) {
      codesUsed++;
    } else if (code.expiredAt < now) {
      codesExpiredUnused++;
    }
  }

  return {
    period: { from: oneWeekAgo, to: now },
    registrations,
    activeAccounts,
    verifiedEmails,
    deletedAccounts,
    codesSent: allCodes.length,
    codesByType,
    codesUsed,
    codesExpiredUnused,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function buildReportHtml(data: ReportData): string {
  const codeTypeRows = (
    Object.entries(data.codesByType) as [CodeType, number][]
  )
    .sort(([, a], [, b]) => b - a)
    .map(
      ([type, count]) =>
        `<tr><td style="padding:4px 8px;border:1px solid #ddd;">${type}</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${count}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#333;max-width:600px;">
      <h2 style="font-size:1.1rem;margin:0 0 4px;">${SITE_NAME} — Weekly CMS Report</h2>
      <p style="color:#888;font-size:13px;margin:0 0 24px;">${formatDate(data.period.from)} – ${formatDate(data.period.to)}</p>

      <h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Accounts</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px;font-size:14px;">
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">New registrations</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.registrations}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Active accounts</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.activeAccounts}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Verified emails</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.verifiedEmails}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Auto-deleted this week</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.deletedAccounts}</td></tr>
      </table>

      <h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Verification Codes</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px;font-size:14px;">
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Total sent</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.codesSent}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Used</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.codesUsed}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #ddd;">Expired unused</td><td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${data.codesExpiredUnused}</td></tr>
      </table>

      ${
        codeTypeRows
          ? `<table style="border-collapse:collapse;width:100%;margin-bottom:24px;font-size:14px;">
        <tr><th style="padding:4px 8px;border:1px solid #ddd;text-align:left;background:#f5f5f5;">By type</th><th style="padding:4px 8px;border:1px solid #ddd;text-align:right;background:#f5f5f5;">Count</th></tr>
        ${codeTypeRows}
      </table>`
          : `<p style="color:#888;font-size:13px;">No verification codes sent this week.</p>`
      }

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#aaa;">Automated report from ${SITE_NAME}</p>
    </div>`;
}

const sendWeeklyReport = async (prisma: PrismaClient): Promise<void> => {
  const data = await gatherReportData(prisma);
  const html = buildReportHtml(data);

  if (env.NODE_ENV !== "production") {
    console.log("sendWeeklyReport (dev)", JSON.stringify(data, null, 2));
    return;
  }

  await resend.emails
    .send({
      from: env.EMAIL_SENDER,
      to: env.REPORT_EMAIL,
      subject: `${SITE_NAME} Weekly Report — ${formatDate(data.period.to)}`,
      html,
    })
    .catch((err) => console.error("Failed to send weekly report:", err))
    .finally(() => console.log("report task concluded"));
};

export default sendWeeklyReport;
