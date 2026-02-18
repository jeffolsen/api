import { RequestLoginForm, LoginWithOTPForm } from "../forms/LoginForm";
import { RequestResetPasswordForm } from "../forms/ResetPasswordForm";
import RegisterForm from "../forms/RegisterForm";
import Block, { BlockProps } from "./Block";
import Tabs, { TabsProps } from "../common/Tabs";
import { OTP_STATUS_LOGIN, useOtpStatus } from "../../network/verificationCode";

const tabs: TabsProps["tabs"] = [
  {
    name: "Login",
    Component: RequestLoginOrLoginWithOtp,
    getTabClasses: () => ["tab"],
  },
  {
    name: "Register",
    Component: RegisterForm,
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

function RequestLoginOrLoginWithOtp() {
  const otpStatus = useOtpStatus();
  if (otpStatus === OTP_STATUS_LOGIN) {
    return <LoginWithOTPForm />;
  }
  return <RequestLoginForm />;
}

export default LoginOrRegisterBlock;
