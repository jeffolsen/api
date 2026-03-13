import {
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
import { withFormHandling } from "../../network/api";

function RequestUnregisterForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const requestUnregister = useRequestDeleteProfile();
  return (
    <FormWithHeading
      fields={[PASSWORD_INPUT]}
      defaultValues={{
        ...PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            await requestUnregister.mutateAsync(
              args as RequestDeleteProfileInput,
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

function UnregisterWithOTPForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const unregisterWithOTP = useDeleteProfileWithOTP();
  return (
    <FormWithHeading
      fields={[VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...VERIFICATION_CODE_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
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
