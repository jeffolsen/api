import {
  EMAIL_INPUT,
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
import { useEmail, withFormHandling } from "../../network/api";

function RequestGenerateApiKeyForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { setEmail, getEmail } = useEmail();
  const requestGenerateApiKey = useRequestGenerateApiKey();

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
            await requestGenerateApiKey.mutateAsync(
              args as RequestGenerateApiKeyInput,
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

function GenerateApiKeyWithOTPForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { getEmail } = useEmail();
  const generateApiKey = useGenerateApiKey();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT, SLUG_INPUT, ORIGIN_INPUT]}
      defaultValues={{
        ...getEmail(),
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
