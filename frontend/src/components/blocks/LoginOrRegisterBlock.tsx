import { RequestLoginForm, LoginWithOTPForm } from "../forms/LoginForm";
import { RequestResetPasswordForm } from "../forms/ResetPasswordForm";
import RegisterForm from "../forms/RegisterForm";
import Block, { BlockProps } from "./Block";
import Tabs, { TabsProps } from "../common/Tabs";
import {
  OTP_STATUS_LOGIN,
  OTP_STATUS_LOGOUT_ALL,
  useOtpStatus,
} from "../../network/verificationCode";
import { LogoutAllSessionsWithOTPForm } from "../forms/LogoutAllSessionsForm";
import { useModalContext } from "../../contexts/ModalContext";
import EmptyModal, { EmptyModalProps } from "../modals/EmptyModal";
import Text from "../common/Text";
import { RequestLogoutAllSessionsForm } from "../forms/LogoutAllSessionsForm";
import DialogModal, { DialogModalProps } from "../modals/DialogModal";

const tabs: TabsProps["tabs"] = [
  {
    name: "Login",
    Component: RequestLoginOrLoginWithOtp,
    getTabClasses: () => ["tab"],
  },
  {
    name: "Register",
    Component: RegisterFormWithSuccessModal,
    getTabClasses: () => ["tab"],
  },
  {
    name: "Reset Password",
    Component: RequestResetPasswordForm,
    getTabClasses: () => ["flex-none text-sm pt-2 order-last"],
  },
];

function LoginOrRegisterBlock(props: BlockProps) {
  return (
    <Block {...props}>
      <Tabs tabs={tabs} tabListClassName="flex flex-wrap justify-end gap-2" />
    </Block>
  );
}

function RegisterFormWithSuccessModal() {
  const { enqueueModals } = useModalContext();

  return (
    <RegisterForm
      handleSuccess={() => {
        enqueueModals([
          {
            component: DialogModal,
            props: {
              title: "Registration Successful!",
              content: "You have been successfully registered.",
            } as DialogModalProps,
          },
        ]);
      }}
    />
  );
}

function RequestLoginOrLoginWithOtp() {
  const otpStatus = useOtpStatus();
  const { enqueueModals } = useModalContext();

  const handleError = (error: Error) => {
    if (error?.cause === 429) {
      enqueueModals([
        {
          component: EmptyModal,
          props: {
            children: <RequestLogoutAllModalContent />,
          } as EmptyModalProps,
        },
      ]);
    } else {
      throw error;
    }
  };

  if (otpStatus === OTP_STATUS_LOGIN) {
    return (
      <LoginWithOTPForm handleError={(error) => handleError(error as Error)} />
    );
  }
  return <RequestLoginForm />;
}

function RequestLogoutAllModalContent() {
  const otpStatus = useOtpStatus();
  const { insertNextOne } = useModalContext();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {otpStatus === OTP_STATUS_LOGOUT_ALL ? (
        <>
          <Text textSize="lg" className="text-center">
            Enter the OTP sent to your email to log out of all sessions.
          </Text>
          <LogoutAllSessionsWithOTPForm
            handleSuccess={() =>
              insertNextOne(
                DialogModal,
                {
                  title: "Success!",
                  content: "You have been logged out of all sessions.",
                } as DialogModalProps,
                true,
              )
            }
          />
        </>
      ) : (
        <>
          <Text textSize="lg" className="text-center">
            You have too many active sessions. You can log out of all of them
            here.
          </Text>
          <RequestLogoutAllSessionsForm />
        </>
      )}
    </div>
  );
}

export default LoginOrRegisterBlock;
