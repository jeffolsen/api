import { TOO_MANY_REQUESTS } from "../../network/api";
import {
  OTP_STATUS_LOGIN,
  OTP_STATUS_LOGOUT_ALL,
  OTP_STATUS_PASSWORD_RESET,
  useOtpStatus,
} from "../../network/verificationCode";
import { RequestLoginForm, LoginWithOTPForm } from "../forms/LoginForm";
import {
  RequestResetPasswordForm,
  ResetPasswordWithOTPForm,
} from "../forms/ResetPasswordForm";
import {
  RequestLogoutAllSessionsForm,
  LogoutAllSessionsWithOTPForm,
} from "../forms/LogoutAllSessionsForm";
import RegisterForm from "../forms/RegisterForm";
import Block, { BlockProps } from "./Block";
import Text from "../common/Text";
import Tabs, { TabsProps, TabPanelProps } from "../common/Tabs";
import { useModalContext } from "../../contexts/ModalContext";
import EmptyModal, { EmptyModalProps } from "../modals/EmptyModal";
import { useSearchParam } from "../../hooks/useSearchParam";
import { toast } from "react-hot-toast";

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
    Component: RequestResetPasswordOrResetWithOtp,
    getTabClasses: () => ["flex-none text-sm pt-2 order-last"],
  },
];

function LoginOrRegisterBlock(props: BlockProps) {
  const { id, ...rest } = props;
  return (
    <Block {...rest}>
      <Tabs
        urlIdentifier={`${id}`}
        tabs={tabs}
        tabListClassName="flex flex-wrap justify-end gap-2"
      />
    </Block>
  );
}

function RegisterFormWithSuccessModal({
  urlIdentifier,
  ...props
}: TabPanelProps) {
  const [, setTabSelected] = useSearchParam(`${urlIdentifier}`);
  return (
    <RegisterForm
      heading="Register"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      handleSuccess={() => {
        toast.success("Registration Successful! You can now log in.");
        setTabSelected("Login");
      }}
      {...props}
    />
  );
}

function RequestLoginOrLoginWithOtp({ ...props }: TabPanelProps) {
  const otpStatus = useOtpStatus();
  const { enqueueModals } = useModalContext();

  const handleError = (error: Error) => {
    if (error?.cause === TOO_MANY_REQUESTS) {
      enqueueModals([
        {
          component: EmptyModal,
          props: {
            closeConfirm: "Do you want to exit the login flow?",
            children: <RequestLogoutAllModalContent {...props} />,
          } as EmptyModalProps,
        },
      ]);
    } else {
      throw error;
    }
  };

  if (otpStatus === OTP_STATUS_LOGIN) {
    return (
      <LoginWithOTPForm
        heading="Enter Email Code"
        headingSize="md"
        headingStyles={"text-center uppercase font-bold text-accent"}
        headingDecorator="strike"
        submitButtonText="Login"
        handleError={(error) => {
          handleError(error as Error);
        }}
        {...props}
      />
    );
  }
  return (
    <RequestLoginForm
      heading="Login"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      {...props}
    />
  );
}

function RequestLogoutAllModalContent({ urlIdentifier }: TabPanelProps) {
  const otpStatus = useOtpStatus();
  const [, setTabSelected] = useSearchParam(`${urlIdentifier}`);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {otpStatus === OTP_STATUS_LOGOUT_ALL ? (
        <>
          <Text textSize="lg" className="text-center">
            Enter the OTP sent to your email.
          </Text>
          <LogoutAllSessionsWithOTPForm
            submitButtonText="Logout of all sessions"
            handleSuccess={() => {
              toast.success("You have been logged out of all sessions.");
              setTabSelected("Login");
            }}
          />
        </>
      ) : (
        <>
          <Text textSize="lg" className="text-center">
            You have too many active sessions. You can log out of all of them
            here.
          </Text>
          <RequestLogoutAllSessionsForm
            submitButtonText="Logout of all sessions"
            submitButtonColor="error"
          />
        </>
      )}
    </div>
  );
}

function RequestResetPasswordOrResetWithOtp({
  urlIdentifier,
  ...props
}: TabPanelProps) {
  const otpStatus = useOtpStatus();
  const [, setTabSelected] = useSearchParam(`${urlIdentifier}`);

  if (otpStatus === OTP_STATUS_PASSWORD_RESET) {
    return (
      <ResetPasswordWithOTPForm
        heading="Enter Email Code"
        headingSize="md"
        headingStyles={"text-center uppercase font-bold text-accent"}
        headingDecorator="strike"
        submitButtonText="Reset Password"
        handleSuccess={() => {
          toast.success("Password reset successful! You can now log in.");
          setTabSelected("Login");
        }}
        {...props}
      />
    );
  }
  return (
    <RequestResetPasswordForm
      heading="Reset Password"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      {...props}
    />
  );
}

export default LoginOrRegisterBlock;
