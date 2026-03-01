import {
  ORIGIN_DEFAULT,
  ORIGIN_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  SLUG_DEFAULT,
  SLUG_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "./Form";
import {
  useRequestGenerateApiKey,
  RequestGenerateApiKeyInput,
} from "../../network/verificationCode";
import { useGenerateApiKey, GenerateApiKeyInput } from "../../network/apiKey";
import { withFormHandling } from "../../network/api";

function RequestGenerateApiKeyForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const requestGenerateApiKey = useRequestGenerateApiKey();

  return (
    <FormWithHeading
      fields={[PASSWORD_INPUT]}
      defaultValues={{
        ...PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await requestGenerateApiKey.mutateAsync(
              args as RequestGenerateApiKeyInput,
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

function GenerateApiKeyWithOTPForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const generateApiKey = useGenerateApiKey();

  return (
    <FormWithHeading
      fields={[VERIFICATION_CODE_INPUT, SLUG_INPUT, ORIGIN_INPUT]}
      defaultValues={{
        ...VERIFICATION_CODE_DEFAULT,
        ...SLUG_DEFAULT,
        ...ORIGIN_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await generateApiKey.mutateAsync(args as GenerateApiKeyInput);
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

export { RequestGenerateApiKeyForm, GenerateApiKeyWithOTPForm };
