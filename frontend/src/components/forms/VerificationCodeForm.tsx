import {
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../network/inputs";
import { FormWithHeading } from "./Form";

function VerificationCodeForm() {
  return (
    <FormWithHeading
      heading="Enter Code"
      headingSize="lg"
      headingStyles={"text-center uppercase font-bold"}
      fields={[VERIFICATION_CODE_INPUT]}
      defaultValues={{ ...VERIFICATION_CODE_DEFAULT }}
      trySubmit={async (args) => {
        console.log(args);
        // await submitCode(args);
      }}
    />
  );
}

export default VerificationCodeForm;
