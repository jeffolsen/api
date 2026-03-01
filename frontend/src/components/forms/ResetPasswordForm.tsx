import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  NEW_PASSWORD_DEFAULT,
  NEW_PASSWORD_INPUT,
  CONFIRM_NEW_PASSWORD_DEFAULT,
  CONFIRM_NEW_PASSWORD_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  EMAIL_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import {
  useRequestPasswordReset,
  RequestPasswordResetInput,
} from "../../network/verificationCode";
import {
  usePasswordResetWithOTP,
  PasswordResetWithOTPFormInput,
  usePasswordResetWithSession,
  PasswordResetWithSessionFormInput,
} from "../../network/profile";
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "./Form";
import { useEmail, withFormHandling } from "../../network/api";

function RequestResetPasswordForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const requestReset = useRequestPasswordReset();
  const { setEmail, getEmail } = useEmail();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await requestReset.mutateAsync(args as RequestPasswordResetInput);
            setEmail((args?.email || "") as string);
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      {...props}
    />
  );
}

function ResetPasswordWithOTPForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const resetPassword = usePasswordResetWithOTP();
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
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
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await resetPassword.mutateAsync(
              args as PasswordResetWithOTPFormInput,
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      {...props}
    />
  );
}

function ResetPasswordWithSessionForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const resetPassword = usePasswordResetWithSession();
  return (
    <FormWithHeading
      fields={[PASSWORD_INPUT, NEW_PASSWORD_INPUT, CONFIRM_NEW_PASSWORD_INPUT]}
      defaultValues={{
        ...PASSWORD_DEFAULT,
        ...NEW_PASSWORD_DEFAULT,
        ...CONFIRM_NEW_PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await resetPassword.mutateAsync(
              args as PasswordResetWithSessionFormInput,
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      {...props}
    />
  );
}

export {
  RequestResetPasswordForm,
  ResetPasswordWithOTPForm,
  ResetPasswordWithSessionForm,
};
