import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function ResetPasswordForm() {
  return (
    <FormWithHeading
      heading="Reset Password"
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
        console.log(args);
        // await resetPassword(args);
      }}
    />
  );
}

export default ResetPasswordForm;
