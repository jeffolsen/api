import {
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
  VERIFICATION_CODE_DEFAULT,
  VERIFICATION_CODE_INPUT,
} from "../../config/inputs";
import {
  RequestLogoutAllSessionsInput,
  useRequestLogoutAllSessions,
} from "../../network/verificationCode";
import {
  useResetSessionsWithOTP,
  ResetSessionsWithOTPFormInput,
  useLogoutAllWithSession,
  LogoutAllWithSessionFormInput,
} from "../../network/session";
import {
  FormWithHeading,
  FormWithHeadingProps,
  FormReponseHandlerProps,
} from "./Form";
import { useEmail, withFormHandling } from "../../network/api";

function RequestLogoutAllSessionsForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const logoutAll = useRequestLogoutAllSessions();
  const { getEmail, setEmail } = useEmail();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, PASSWORD_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            await logoutAll.mutateAsync(args as RequestLogoutAllSessionsInput);
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

function LogoutAllSessionsWithOTPForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const logoutAll = useResetSessionsWithOTP();
  const { getEmail } = useEmail();
  return (
    <FormWithHeading
      fields={[EMAIL_INPUT, VERIFICATION_CODE_INPUT]}
      defaultValues={{
        ...getEmail(),
        ...VERIFICATION_CODE_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            await logoutAll.mutateAsync(args as ResetSessionsWithOTPFormInput);
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

function LogoutAllSessionsWithSessionForm({
  handleSuccess,
  handleError,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const logoutAll = useLogoutAllWithSession();
  return (
    <FormWithHeading
      fields={[PASSWORD_INPUT]}
      defaultValues={{
        ...PASSWORD_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            await logoutAll.mutateAsync(args as LogoutAllWithSessionFormInput);
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

export {
  RequestLogoutAllSessionsForm,
  LogoutAllSessionsWithOTPForm,
  LogoutAllSessionsWithSessionForm,
};
