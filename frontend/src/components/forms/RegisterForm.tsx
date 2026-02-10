import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";
import { RegisterFormInput } from "../../network/api";
import { useApi } from "../../network/useApi";

function RegisterForm() {
  const { register } = useApi();
  return (
    <FormWithHeading
      heading="Register"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        await register.mutate(args as RegisterFormInput);
      }}
    />
  );
}

export default RegisterForm;
