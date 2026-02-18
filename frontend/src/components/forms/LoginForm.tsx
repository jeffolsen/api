import {
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import { FormWithHeading } from "./Form";
import {
  useRequestLogin,
  useLoginWithOTP,
  RequestLoginFormInput,
  LoginWithOTPFormInput,
} from "../../network/auth";

function RequestLoginForm() {
  const login = useRequestLogin();

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
        await login.mutate(args as RequestLoginFormInput);
      }}
    />
  );
}

function LoginWithOTPForm() {
  const loginWithOTP = useLoginWithOTP();

  return (
    <FormWithHeading
      heading="Enter Email Code"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="none"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{ ...EMAIL_DEFAULT, ...VERIFICATION_CODE_DEFAULT }}
      trySubmit={async (args) => {
        await loginWithOTP.mutate(args as LoginWithOTPFormInput);
      }}
    />
  );
}

export { RequestLoginForm, LoginWithOTPForm };
