import { PropsWithChildren } from "react";
import { Modal, ModalCloseXButton } from "./Modal";

export type EmptyModalProps = PropsWithChildren;

function EmptyModal({ children }: EmptyModalProps) {
  return (
    <Modal modalStyles="bg-neutral text-neutral-content w-full text-center max-w-xl">
      <ModalCloseXButton />
      {children}
    </Modal>
  );
}

export default EmptyModal;
