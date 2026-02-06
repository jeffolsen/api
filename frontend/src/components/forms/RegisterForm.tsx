import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function RegisterForm() {
  return (
    <FormWithHeading
      heading="Register"
      headingSize="lg"
      headingStyles={"text-center uppercase font-bold"}
      fields={[EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await register(args);
      }}
    />
  );
}

export default RegisterForm;
