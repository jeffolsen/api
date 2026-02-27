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
import { useEmail, withFormHandling } from "../../network/api";

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
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await login.mutateAsync(args as RequestLoginFormInput);
            if (args.email) {
              setEmail(args.email as string);
            }
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
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
      trySubmit={async (args) =>
        withFormHandling(
          async () => loginWithOTP.mutateAsync(args as LoginWithOTPFormInput),
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
    />
  );
}

export { RequestLoginForm, LoginWithOTPForm };
