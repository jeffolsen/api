import {
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";
import { LoginFormInput } from "../../network/api";
import { useApi } from "../../network/useApi";

function LoginForm() {
  const { login } = useApi();

  return (
    <FormWithHeading
      heading="Login"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        await login.mutate(args as LoginFormInput);
      }}
    />
  );
}

export default LoginForm;
