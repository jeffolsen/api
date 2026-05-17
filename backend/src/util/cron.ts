import env from "@/config/env";
import prismaClient from "@/db/client";
import cron from "node-cron";

export const initCronJobs = (): void => {
  const onceAtLunchOnceAtMidnight = "0 0,12 * * *";
  const onceAnHour = "0 * * * *";
  const onceAMinute = "* * * * *";

  cron.schedule(
    onceAnHour,
    async () => {
      console.log("Starting profile cleanup task...");
      try {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        console.log("one week ago", date.toLocaleString());

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
          console.log(
            "profiles receipts for deleted",
            jobResult.profilesReceipts,
          );
          console.log(
            "remaining profiles in the system",
            jobResult.remainingProfiles,
          );
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
};
