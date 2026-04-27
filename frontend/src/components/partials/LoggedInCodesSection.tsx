import BasicCard from "@/components/cards/BasicCard";
import SectionHeading from "@/components/partials/SectionHeading";
import { useGetProfileVerificationCodes } from "@/network/verificationCode";
import Grid from "@/components/common/Grid";
import Loading from "@/components/common/Loading";
import DropDownMenu, { DropDownItem } from "@/components/common/DropDownMenu";
import { useCallback, useMemo, useState } from "react";
import dayjs, { longDate, techDatetime } from "@/utils/dayjs";

type VerificationCode = {
  id: number;
  type: string;
  createdAt: string;
};

function LoggedInCodesSection() {
  const getVerificationCodes = useGetProfileVerificationCodes();

  const verificationCodes = useMemo(
    () => getVerificationCodes?.data?.codes || [],
    [getVerificationCodes.data],
  );

  const today = useMemo(
    () =>
      ({
        id: dayjs(dayjs()).startOf("day").toISOString(),
        label: "Today's Activities",
      }) as DropDownItem,
    [],
  );

  const [dateFilter, setDateFilter] = useState<DropDownItem>(today);

  const getDates = useCallback(() => {
    if (verificationCodes) {
      const dates = verificationCodes
        ?.map((code: VerificationCode) => {
          if (dayjs(code.createdAt).isToday()) return today;
          return {
            id: dayjs(code.createdAt).startOf("day").toISOString(),
            label: dayjs(code.createdAt).format(longDate),
          };
        })
        .concat([today])
        .filter((item: DropDownItem, index: number, arr: DropDownItem[]) => {
          return arr.findIndex((obj) => obj.id === item.id) === index;
        })
        .sort((a: DropDownItem, b: DropDownItem) => b.id.localeCompare(a.id));

      return dates;
    }
    return [];
  }, [verificationCodes, today]);

  if (getVerificationCodes.isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        text="History"
        description="Your recent verification code generation history."
      >
        <DropDownMenu
          items={getDates()}
          onChange={(item) => setDateFilter(item)}
          className="flex-1"
        />
      </SectionHeading>
      {verificationCodes && (
        <Grid
          columns={{ base: "2", sm: "3", lg: "4", xl: "5" }}
          items={verificationCodes
            ?.filter((code: VerificationCode) => {
              return dateFilter
                ? dayjs(code.createdAt).startOf("day").toISOString() ===
                    dateFilter.id
                : true;
            })
            .map((verificationCodes: { type: string; createdAt: string }) => (
              <BasicCard
                title={verificationCodes.type}
                description={dayjs(verificationCodes.createdAt).format(
                  techDatetime,
                )}
              />
            ))}
          onEmpty={() => (
            <BasicCard
              title="No Verification Codes"
              description={`${dateFilter.label} has no verification codes.`}
            />
          )}
        />
      )}
    </div>
  );
}

export default LoggedInCodesSection;
