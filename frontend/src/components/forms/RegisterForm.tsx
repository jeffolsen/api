import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../config/inputs";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { RegisterFormInput, useRegister } from "../../network/auth";
import { useEmail } from "../../network/api";

function RegisterForm({ handleSuccess, handleError }: FormWrapperProps) {
  const register = useRegister();
  const { setEmail, getEmail } = useEmail();

  return (
    <FormWithHeading
      heading="Register"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await register.mutateAsync(args as RegisterFormInput);
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

export default RegisterForm;
