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
  useRequestDestroyApiKey,
  RequestDestroyApiKeyInput,
} from "../../network/verificationCode";
import { useDestroyApiKey, DestroyApiKeyInput } from "../../network/apiKey";
import { useEmail, withFormHandling } from "../../network/api";

function RequestDestroyApiKeyForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { setEmail, getEmail } = useEmail();
  const requestDestroyApiKey = useRequestDestroyApiKey();

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
            await requestDestroyApiKey.mutateAsync(
              args as RequestDestroyApiKeyInput,
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

function DestroyApiKeyWithOTPForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const { getEmail } = useEmail();
  const destroyApiKey = useDestroyApiKey();
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
