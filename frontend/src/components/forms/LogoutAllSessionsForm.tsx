import {
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import {
  RequestLogoutAllSessionsInput,
  useRequestLogoutAllSessions,
} from "../../network/verificationCode";
import {
  useLogoutAllWithOTP,
  LogoutAllWithOTPFormInput,
} from "../../network/session";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useEmail } from "../../network/api";

function RequestLogoutAllSessionsForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const logoutAll = useRequestLogoutAllSessions();
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
      submitButtonText="Logout of all sessions"
      submitButtonColor="error"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await logoutAll.mutateAsync(args as RequestLogoutAllSessionsInput);
          handleSuccess?.();
        } catch (error) {
          if (handleError) {
            handleError(error as Error);
          } else {
            throw error;
          }
        }
      }}
    />
  );
}

function LogoutAllSessionsWithOTPForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const logoutAll = useLogoutAllWithOTP();
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
      submitButtonText="Logout of all sessions with OTP"
      submitButtonColor="error"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await logoutAll.mutateAsync(args as LogoutAllWithOTPFormInput);
          handleSuccess?.();
        } catch (error) {
          if (handleError) {
            handleError(error as Error);
          } else {
            throw error;
          }
        }
      }}
    />
  );
}

export { RequestLogoutAllSessionsForm, LogoutAllSessionsWithOTPForm };
