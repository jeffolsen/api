import Heading from "../common/Heading";
import { ModalComponentType } from "../../contexts/ModalContext";
import { DialogPanel } from "@headlessui/react";
import { ModalCloseButton, ModalNextButton } from "./Modal";

export type GammaModalProps = ModalComponentType & {
  title?: string;
  content?: string;
};

const GammaModal = ({ title, content }: GammaModalProps) => {
  return (
    <DialogPanel className="modal-box">
      <ModalCloseButton />

      {title && <Heading>{title}</Heading>}
      {content && <p>{content}</p>}

      <div className="modal-action">
        <ModalNextButton text="Next" />
      </div>
    </DialogPanel>
  );
};
export default GammaModal;
