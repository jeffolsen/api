import {
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import { FormWithHeading, FormWrapperProps } from "./Form";
import { useLoginWithOTP, LoginWithOTPFormInput } from "../../network/auth";
import {
  useRequestLogin,
  RequestLoginFormInput,
} from "../../network/verificationCode";
import { useEmail } from "../../network/api";

function RequestLoginForm({ handleError, handleSuccess }: FormWrapperProps) {
  const login = useRequestLogin();
  const { setEmail, getEmail } = useEmail();

  return (
    <FormWithHeading
      heading="Login"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await login.mutateAsync(args as RequestLoginFormInput);
          if (args.email) {
            setEmail(args.email as string);
          }
          handleSuccess?.();
        } catch (error) {
          if (handleError) {
            handleError(error as Error);
          } else {
            throw error;
          }
        }
      }}
    />
  );
}

function LoginWithOTPForm({ handleError, handleSuccess }: FormWrapperProps) {
  const loginWithOTP = useLoginWithOTP();
  const { getEmail } = useEmail();

  return (
    <FormWithHeading
      heading="Enter Email Code"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="none"
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
      }}
      trySubmit={async (args) => {
        try {
          await loginWithOTP.mutateAsync(args as LoginWithOTPFormInput);
          handleSuccess?.();
        } catch (error) {
          if (handleError) {
            handleError(error as Error);
          } else {
            throw error;
          }
        }
      }}
    />
  );
}

export { RequestLoginForm, LoginWithOTPForm };
