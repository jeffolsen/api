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
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useEmail } from "../../network/api";

function RequestGenerateApiKeyForm({
  handleError,
  handleSuccess,
}: FormWrapperProps) {
  const { setEmail, getEmail } = useEmail();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      submitButtonText="Generate API Key"
      submitButtonColor="success"
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          console.log(args);
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

function GenerateApiKeyWithOTPForm({
  handleError,
  handleSuccess,
}: FormWrapperProps) {
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
      heading="Generate API Key"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT, SLUG_INPUT, ORIGIN_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
        ...SLUG_DEFAULT,
        ...ORIGIN_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          console.log(args);
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

export { RequestGenerateApiKeyForm, GenerateApiKeyWithOTPForm };
