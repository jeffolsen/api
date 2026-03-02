import { ModalComponentType } from "../../contexts/ModalContext";
import { Modal, ModalCloseXButton, ModalCloseButton } from "./Modal";
import Heading from "../common/Heading";
import Text from "../common/Text";

export type DialogModalProps = ModalComponentType & {
  title?: string;
  content?: string;
  onClose?: () => void;
};

function DialogModal({ title, content, onClose }: DialogModalProps) {
  return (
    <Modal
      modalStyles="bg-neutral text-neutral-content w-full text-center max-w-xl"
      onClose={onClose}
    >
      <ModalCloseXButton />
      {title && <Heading headingSize="lg">{title}</Heading>}
      {content && <Text textSize="lg">{content}</Text>}
      <div className="modal-action">
        <div className="flex-shrink">
          <ModalCloseButton />
        </div>
      </div>
    </Modal>
  );
}

export default DialogModal;
