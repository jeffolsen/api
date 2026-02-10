import {
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function VerificationCodeForm() {
  return (
    <FormWithHeading
      heading="Enter Code"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{ ...EMAIL_DEFAULT, ...VERIFICATION_CODE_DEFAULT }}
      trySubmit={async (args) => {
        console.log(args);
        // await submitCode(args);
      }}
    />
  );
}

export default VerificationCodeForm;
