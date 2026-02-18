import {
  EMAIL_DEFAULT,
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
import { FormWithHeading } from "./Form";

function RequestResetPasswordForm() {
  return (
    <FormWithHeading
      heading="Reset Password"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await resetPassword(args);
      }}
    />
  );
}

function ResetPasswordWithOTPForm() {
  return (
    <FormWithHeading
      heading="Reset Password"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT, SLUG_INPUT, ORIGIN_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...VERIFICATION_CODE_DEFAULT,
        ...SLUG_DEFAULT,
        ...ORIGIN_DEFAULT,
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await resetPassword(args);
      }}
    />
  );
}

export { RequestResetPasswordForm, ResetPasswordWithOTPForm };
