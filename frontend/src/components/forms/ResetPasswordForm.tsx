import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useEmail } from "../../network/api";
import {
  useRequestPasswordReset,
  RequestPasswordResetInput,
} from "../../network/verificationCode";
import {
  usePasswordResetWithOTP,
  PasswordResetWithOTPFormInput,
} from "../../network/profile";

function RequestResetPasswordForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const requestReset = useRequestPasswordReset();
  const { setEmail, getEmail } = useEmail();
  return (
    <FormWithHeading
      heading="Reset Password"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT]}
      defaultValues={{
        ...getEmail(),
      }}
      trySubmit={async (args) => {
        try {
          await requestReset.mutateAsync(args as RequestPasswordResetInput);
          if (args.email) {
            setEmail(args.email as string);
          }
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

function ResetPasswordWithOTPForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const resetPassword = usePasswordResetWithOTP();
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
      heading="Reset Password"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[
        EMAIL_INPUT,
        VERIFICATION_CODE_INPUT,
        PASSWORD_INPUT,
        CONFIRM_PASSWORD_INPUT,
      ]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await resetPassword.mutateAsync(
            args as PasswordResetWithOTPFormInput,
          );
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

export { RequestResetPasswordForm, ResetPasswordWithOTPForm };
