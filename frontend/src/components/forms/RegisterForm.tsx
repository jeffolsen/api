import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../config/inputs";
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "./Form";
import { RegisterFormInput, useRegister } from "../../network/auth";
import { useEmail, withFormHandling } from "../../network/api";

function RegisterForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const register = useRegister();
  const { setEmail, getEmail } = useEmail();

  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await register.mutateAsync(args as RegisterFormInput);
            setEmail((args?.email || "") as string);
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      {...props}
    />
  );
}

export default RegisterForm;
