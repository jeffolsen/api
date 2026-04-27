import {
  OTP_STATUS_DELETE_PROFILE,
  useOtpStatus,
} from "@/network/verificationCode";
import {
  RequestUnregisterForm,
  UnregisterWithOTPForm,
} from "@/components/forms/UnregisterForm";
import { ResetPasswordWithSessionForm } from "@/components/forms/ResetPasswordForm";
import RevealCard from "@/components/cards/RevealCard";
import SectionHeading from "@/components/partials/SectionHeading";

function LoggedInDeleteProfileSection() {
  const otpStatus = useOtpStatus();
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading text="Profile Administration"></SectionHeading>
      <RevealCard
        title="Change Password"
        description="Changing your password will log you out of all sessions except the current one."
        buttonLabel="Change Password"
        buttonColor="primary"
      >
        <ResetPasswordWithSessionForm
          submitInputConfig={{ text: "Change Password" }}
        />
      </RevealCard>
      <RevealCard
        title="Delete Profile"
        buttonLabel="Delete Profile"
        buttonColor="error"
        description={
          otpStatus === OTP_STATUS_DELETE_PROFILE
            ? "Enter the OTP sent to your email to confirm profile deletion."
            : "Deleting your profile is permanent and cannot be undone."
        }
      >
        {otpStatus === OTP_STATUS_DELETE_PROFILE ? (
          <UnregisterWithOTPForm
            submitInputConfig={{
              color: "error",
              text: "Delete Profile",
            }}
          />
        ) : (
          <RequestUnregisterForm
            submitInputConfig={{
              color: "error",
              text: "Delete Profile",
            }}
          />
        )}
      </RevealCard>
    </div>
  );
}

export default LoggedInDeleteProfileSection;
