import { PropsWithChildren } from "react";
import { Modal, ModalCloseXButton, ModalProps } from "./Modal";

export type EmptyModalProps = PropsWithChildren<ModalProps>;

function EmptyModal({ children, ...props }: EmptyModalProps) {
  return (
    <Modal
      modalStyles="bg-neutral text-neutral-content w-full text-center max-w-xl"
      {...props}
    >
      <ModalCloseXButton />
      {children}
    </Modal>
  );
}

export default EmptyModal;
