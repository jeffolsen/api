import { TOO_MANY_REQUESTS } from "@/network/api";
import {
  OTP_STATUS_LOGIN,
  OTP_STATUS_LOGOUT_ALL,
  OTP_STATUS_PASSWORD_RESET,
  useOtpStatus,
} from "@/network/verificationCode";
import {
  RequestLoginForm,
  LoginWithOTPForm,
} from "@/components/forms/LoginForm";
import {
  RequestResetPasswordForm,
  ResetPasswordWithOTPForm,
} from "@/components/forms/ResetPasswordForm";
import {
  RequestLogoutAllSessionsForm,
  LogoutAllSessionsWithOTPForm,
} from "@/components/forms/LogoutAllSessionsForm";
import RegisterForm from "@/components/forms/RegisterForm";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import Text from "@/components/common/Text";
import Tabs, { TabsProps, TabPanelProps } from "@/components/common/Tabs";
import { useSearchParam } from "@/hooks/useSearchParam";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Modal from "@/components/layout/Modal";
import useCmsLoginOrRegisterBlockData, {
  UseLoginOrRegisterBlockData,
  UseLoginOrRegisterBlockProps,
} from "@/components/blocks/CmsLoginOrRegisterBlock/data";

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

export default function Component(config: BlockComponentStandardProps) {
  const result = useCmsLoginOrRegisterBlockData(config);
  if (result.type === "error") {
    // Optionally, you could display an error message here
    return null;
  }
  const { blockProps, blockData } = result;

  return (
    <CmsLoginOrRegisterBlock blockProps={blockProps} blockData={blockData} />
  );
}

function CmsLoginOrRegisterBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseLoginOrRegisterBlockProps;
  blockData: UseLoginOrRegisterBlockData;
}) {
  return (
    <Block {...blockProps}>
      <Tabs
        urlIdentifier={`${blockData.id}`}
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
  const [openLogoutAllModal, setOpenLogoutAllModal] = useState(false);

  const handleError = (error: Error) => {
    if (error?.cause === TOO_MANY_REQUESTS) {
      setOpenLogoutAllModal(true);
    } else {
      throw error;
    }
  };

  return (
    <>
      {otpStatus === OTP_STATUS_LOGIN ? (
        <LoginWithOTPForm
          heading="Enter Email Code"
          headingSize="md"
          headingStyles={"text-center uppercase font-bold text-accent"}
          headingDecorator="strike"
          submitInputConfig={{ text: "Login" }}
          {...props}
        />
      ) : (
        <RequestLoginForm
          heading="Login"
          headingSize="md"
          headingStyles={"text-center uppercase font-bold text-accent"}
          headingDecorator="strike"
          handleError={(error) => {
            handleError(error as Error);
          }}
          {...props}
        />
      )}
      <Modal isOpen={openLogoutAllModal} setIsOpen={setOpenLogoutAllModal}>
        <RequestLogoutAllModalContent
          {...props}
          setOpenLogoutAllModal={setOpenLogoutAllModal}
        />
      </Modal>
    </>
  );
}

function RequestLogoutAllModalContent({
  urlIdentifier,
  setOpenLogoutAllModal,
}: TabPanelProps & { setOpenLogoutAllModal: (open: boolean) => void }) {
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
            submitInputConfig={{ text: "Logout of all sessions" }}
            handleSuccess={() => {
              toast.success("You have been logged out of all sessions.");
              setTabSelected("Login");
              setOpenLogoutAllModal(false);
            }}
          />
        </>
      ) : (
        <>
          <Text textSize="lg" className="text-center px-4">
            You have too many active sessions.
            <br className="hidden md:inline" /> You can log out of all of them
            here.
          </Text>
          <RequestLogoutAllSessionsForm
            submitInputConfig={{
              color: "error",
              text: "Logout of all sessions",
            }}
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
        submitInputConfig={{
          text: "Reset Password",
        }}
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
