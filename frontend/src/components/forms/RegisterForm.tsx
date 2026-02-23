import {
  CONFIRM_PASSWORD_DEFAULT,
  CONFIRM_PASSWORD_INPUT,
  EMAIL_DEFAULT,
  EMAIL_INPUT,
  PASSWORD_DEFAULT,
  PASSWORD_INPUT,
} from "../../config/inputs";
import { FormWithHeading } from "./Form";
import { RegisterFormInput, useRegister } from "../../network/auth";
import { useModalContext } from "../../contexts/ModalContext";
import SuccessModal, { SuccessModalProps } from "../modals/SuccessModal";

function RegisterForm() {
  const register = useRegister();
  const { enqueueModals } = useModalContext();

  return (
    <FormWithHeading
      heading="Register"
      headingSize="md"
      headingStyles={"text-center uppercase font-bold text-accent"}
      headingDecorator="strike"
      fields={[EMAIL_INPUT, PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT]}
      defaultValues={{
        ...EMAIL_DEFAULT,
        ...PASSWORD_DEFAULT,
        ...CONFIRM_PASSWORD_DEFAULT,
      }}
      trySubmit={async (args) => {
        await register.mutateAsync(args as RegisterFormInput);
        enqueueModals([
          {
            component: SuccessModal,
            props: {
              title: "Registration Successful!",
              content: "You have been successfully registered.",
            } as SuccessModalProps,
          },
        ]);
      }}
    />
  );
}

export default RegisterForm;
