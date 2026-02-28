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
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "./Form";
import { useEmail, withFormHandling } from "../../network/api";

function RequestUnregisterForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { getEmail, setEmail } = useEmail();
  const requestUnregister = useRequestDeleteProfile();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await requestUnregister.mutateAsync(
              args as RequestDeleteProfileInput,
            );
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

function UnregisterWithOTPForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { getEmail } = useEmail();
  const unregisterWithOTP = useDeleteProfileWithOTP();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await unregisterWithOTP.mutateAsync(
              args as DeleteProfileWithOTPFormInput,
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

export { RequestUnregisterForm, UnregisterWithOTPForm };
