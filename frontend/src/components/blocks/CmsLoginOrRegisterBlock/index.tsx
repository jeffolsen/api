import { TOO_MANY_REQUESTS } from "@/network/api";
import {
  OTP_STATUS_LOGIN,
  OTP_STATUS_LOGOUT_ALL,
  OTP_STATUS_PASSWORD_RESET,
} from "@/network/verificationCode/types";
import { useOtpStatus } from "@/network/verificationCode/useOtpStatus";
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
import Tabs, { TabsProps } from "@/components/common/Tabs";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Modal from "@/components/layout/Modal";
import useCmsLoginOrRegisterBlockData, {
  UseLoginOrRegisterBlockData,
  UseLoginOrRegisterBlockProps,
} from "@/components/blocks/CmsLoginOrRegisterBlock/data";
import List, { ListItem } from "@/components/common/List";

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
}: {
  blockProps: UseLoginOrRegisterBlockProps;
  blockData: UseLoginOrRegisterBlockData;
}) {
  console.log("CmsLoginOrRegisterBlock", blockProps);
  return (
    <>
      <div className="prose">
        <Text textSize="md">
          The content, images, and designs displayed on this website are
          showcased for demonstration and portfolio purposes only and are not
          for commercial use.
        </Text>
        <List textSize="md">
          <ListItem>
            <strong>No Warranties</strong>: All information and features
            (including authentication) are provided "AS IS" and "AS AVAILABLE"
            without any guarantees of accuracy, completeness, or reliability.
          </ListItem>
          <ListItem>
            <strong>Limitation of Liability</strong>: I am not liable for any
            losses or damages arising from your use of this site.
          </ListItem>
          <ListItem>
            <strong>Content Ownership</strong>: Unless otherwise stated, all
            material is the property of [Your Name] and may not be reproduced
            without explicit permission.
          </ListItem>
          <ListItem>
            <strong>External Links</strong>: I am not responsible for the
            content or privacy practices of any linked third-party websites.
          </ListItem>
        </List>
        <Text textSize="md">
          If you would like err on the side of caution or remain anonymous there
          are disposable email account services that you can use to sign in so
          that you can tour the CMS.
        </Text>
      </div>
      <Block {...blockProps}>
        <Tabs tabs={tabs} tabListClassName="flex flex-wrap justify-end gap-2" />
      </Block>
    </>
  );
}

function RegisterFormWithSuccessModal({ ...props }) {
  return (
    <RegisterForm
      heading="Register"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      handleSuccess={() => {
        toast.success("Registration Successful! You can now log in.");
      }}
      {...props}
    />
  );
}

function RequestLoginOrLoginWithOtp({ ...props }) {
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
  setOpenLogoutAllModal,
}: {
  setOpenLogoutAllModal: (open: boolean) => void;
}) {
  const otpStatus = useOtpStatus();

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
              color: "accent",
              text: "Logout of all sessions",
            }}
          />
        </>
      )}
    </div>
  );
}

function RequestResetPasswordOrResetWithOtp({ ...props }) {
  const otpStatus = useOtpStatus();

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
