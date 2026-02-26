import {
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useEmail } from "../../network/api";

function RequestUnregisterForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const { getEmail, setEmail } = useEmail();
  return (
    <FormWithHeading
      heading="Unregister Email"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
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

function UnregisterWithOTPForm({
  handleSuccess,
  handleError,
}: FormWrapperProps) {
  const { getEmail } = useEmail();
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

export { RequestUnregisterForm, UnregisterWithOTPForm };
