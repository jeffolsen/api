import BasicCard from "../cards/BasicCard";
import SectionHeading from "./SectionHeading";
import { useGetProfileVerificationCodes } from "../../network/verificationCode";
import Grid from "../common/Grid";

function LoggedInCodesSection() {
  const getVerificationCodes = useGetProfileVerificationCodes();

  const verificationCodes = getVerificationCodes.data;

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading text="History" />
      {verificationCodes && (
        <Grid
          columns={{ base: "2", sm: "3", md: "3", lg: "4", xl: "5" }}
          items={verificationCodes?.map(
            (verificationCodes: { type: string; createdAt: string }) => (
              <BasicCard
                title={verificationCodes.type}
                description={new Date(
                  verificationCodes.createdAt,
                ).toLocaleString()}
              />
            ),
          )}
        />
      )}
    </div>
  );
}

export default LoggedInCodesSection;
