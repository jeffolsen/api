import { DialogPanel } from "@headlessui/react";
import { PropsWithChildren } from "react";
import { ModalCloseButton } from "./Modal";

export type FormModalProps = PropsWithChildren;

function FormModal({ children }: FormModalProps) {
  return (
    <DialogPanel className="modal-box">
      <ModalCloseButton />
      {children}
    </DialogPanel>
  );
}

export default FormModal;
