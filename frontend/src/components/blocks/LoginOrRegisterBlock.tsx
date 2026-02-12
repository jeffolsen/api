import { RequestLoginForm, LoginWithOTPForm } from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Block, { BlockProps } from "./Block";
import { useModalContext } from "../../contexts/ModalContext";
import FormModal, { FormModalProps } from "../modals/FormModal";
import Tabs, { TabsProps } from "../common/Tabs";

const tabs: TabsProps["tabs"] = [
  {
    name: "Login",
    Component: RequestLoginForm,
  },
  {
    name: "Register",
    Component: RegisterForm,
  },
];

type LoginOrRegisterBlockProps = BlockProps;

function LoginOrRegisterBlock(props: LoginOrRegisterBlockProps) {
  const { enqueueModals } = useModalContext();

  return (
    <Block {...props}>
      <Tabs tabs={tabs} />
      <button
        className="btn btn-primary btn-block"
        onClick={() => {
          enqueueModals([
            {
              component: FormModal,
              props: { children: <LoginWithOTPForm /> } as FormModalProps,
            },
          ]);
        }}
      >
        Login
      </button>
    </Block>
  );
}

export default LoginOrRegisterBlock;
