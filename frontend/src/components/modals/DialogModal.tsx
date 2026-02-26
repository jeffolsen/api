import { ModalComponentType } from "../../contexts/ModalContext";
import { Modal, ModalCloseXButton, ModalCloseButton } from "./Modal";
import Heading from "../common/Heading";
import Text from "../common/Text";

export type DialogModalProps = ModalComponentType & {
  title?: string;
  content?: string;
};

function DialogModal({ title, content }: DialogModalProps) {
  return (
    <Modal modalStyles="bg-secondary text-secondary-content w-full text-center max-w-xl">
      <ModalCloseXButton />
      {title && (
        <Heading headingSize="lg" headingStyles="text-secondary-content/75">
          {title}
        </Heading>
      )}
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
