import {
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  SLUG_DEFAULT,
  SLUG_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "@/config/inputs";
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "@/components/forms/Form";
import {
  useRequestDestroyApiKey,
  RequestDestroyApiKeyInput,
} from "@/network/verificationCode";
import { useDestroyApiKey, DestroyApiKeyInput } from "@/network/apiKey";
import { withFormHandling } from "@/network/api";

function RequestDestroyApiKeyForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const requestDestroyApiKey = useRequestDestroyApiKey();

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
            await requestDestroyApiKey.mutateAsync(
              args as RequestDestroyApiKeyInput,
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

function DestroyApiKeyWithOTPForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const destroyApiKey = useDestroyApiKey();
  return (
    <FormWithHeading
      fields={[VERIFICATION_CODE_INPUT, SLUG_INPUT]}
      defaultValues={{
        ...VERIFICATION_CODE_DEFAULT,
        ...SLUG_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            await destroyApiKey.mutateAsync(args as DestroyApiKeyInput);
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

export { RequestDestroyApiKeyForm, DestroyApiKeyWithOTPForm };
