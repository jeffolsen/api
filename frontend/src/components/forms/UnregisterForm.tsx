import {
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function RequestUnregisterForm() {
  return (
    <FormWithHeading
      heading="Unregister Email"
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

function UnregisterWithOTPForm() {
  return (
    <FormWithHeading
      heading="Unregister Email"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...VERIFICATION_CODE_DEFAULT,
      }}
      trySubmit={async (args) => {
        console.log(args);
        // await resetPassword(args);
      }}
    />
  );
}

export { RequestUnregisterForm, UnregisterWithOTPForm };
