import { PropsWithChildren } from "react";
import { Modal, ModalCloseButton } from "./Modal";

export type FormModalProps = PropsWithChildren;

function FormModal({ children }: FormModalProps) {
  const confirm = "Are you sure you want to quit login?";
  return (
    <Modal closeConfirm={confirm}>
      <ModalCloseButton confirm={confirm} />
      {children}
    </Modal>
  );
}

export default FormModal;
