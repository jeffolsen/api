import env from "@/config/env";
import prismaClient from "@/db/client";
import cron from "node-cron";
import sendWeeklyReport from "@/util/sendReport";

export const initCronJobs = (): void => {
  const mondayAt8am = "0 8 * * 1";
  const onceAtLunchOnceAtMidnight = "0 0,12 * * *";
  const onceAnHour = "0 * * * *";
  const onceAMinute = "* * * * *";

  cron.schedule(
    onceAtLunchOnceAtMidnight,
    async () => {
      console.log("Starting profile cleanup task...");
      try {
        const date = new Date();
        date.setDate(date.getDate() - 7);

        if (env.ADMIN_USER?.length) {
          const staleProfileWhere = {
            createdAt: { lt: date },
            NOT: {
              email: env.ADMIN_USER,
            },
          };
          const jobResult = await prismaClient.$transaction(async (tx) => {
            const profilesReceipts = await tx.profileReceipt.updateMany({
              where: {
                profile: staleProfileWhere,
              },
              data: { deletedAt: new Date() },
            });
            await tx.profile.deleteMany({
              where: staleProfileWhere,
            });
            const remainingProfiles = await tx.profile.findMany();
            return { profilesReceipts, remainingProfiles };
          });
        } else {
          console.warn("Cannot complete profile cleanup without configuration");
        }
      } catch (error) {
        console.error("Error executing cron database query:", error);
      }
    },
    {
      timezone: "America/New_York",
    },
  );

  cron.schedule(
    mondayAt8am,
    async () => {
      try {
        console.log("sending report");
        await sendWeeklyReport(prismaClient);
      } catch (error) {
        console.error("Error sending weekly report:", error);
      }
    },
    {
      timezone: "America/New_York",
    },
  );
};
