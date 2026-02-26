import { PropsWithChildren } from "react";
import { Modal, ModalCloseXButton } from "./Modal";

export type EmptyModalProps = PropsWithChildren;

function EmptyModal({ children }: EmptyModalProps) {
  return (
    <Modal>
      <ModalCloseXButton />
      {children}
    </Modal>
  );
}

export default EmptyModal;
