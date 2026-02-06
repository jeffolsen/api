import {
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function LoginForm() {
  return (
    <FormWithHeading
      heading="Login"
      headingSize="lg"
      headingStyles={"text-center uppercase font-bold"}
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await login(args);
      }}
    />
  );
}

export default LoginForm;
