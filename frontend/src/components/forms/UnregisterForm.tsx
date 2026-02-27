import {
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import {
  useDeleteProfileWithOTP,
  DeleteProfileWithOTPFormInput,
} from "../../network/profile";
import {
  useRequestDeleteProfile,
  RequestDeleteProfileInput,
} from "../../network/verificationCode";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useEmail } from "../../network/api";

function RequestUnregisterForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const { getEmail, setEmail } = useEmail();
  const requestUnregister = useRequestDeleteProfile();
  return (
    <FormWithHeading
      submitButtonColor="error"
      submitButtonText="Delete Profile"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await requestUnregister.mutateAsync(
            args as RequestDeleteProfileInput,
          );
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

function UnregisterWithOTPForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const { getEmail } = useEmail();
  const unregisterWithOTP = useDeleteProfileWithOTP();
  return (
    <FormWithHeading
      heading="Unregister Email"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await unregisterWithOTP.mutateAsync(
            args as DeleteProfileWithOTPFormInput,
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

export { RequestUnregisterForm, UnregisterWithOTPForm };
