import Heading from "../common/Heading";
import {
  ModalComponentType,
  useModalContext,
  useModalLimit,
} from "../../contexts/ModalContext";
import BetaModal, { BetaModalProps } from "./BetaModal";
import { DialogPanel } from "@headlessui/react";
import { ModalCloseButton, ModalBackButton, ModalGenericButton } from "./Modal";

export type AlphaModalProps = ModalComponentType & {
  title?: string;
  content?: string;
};

const AlphaModal = ({ title, content }: AlphaModalProps) => {
  const { insertNextOne, modalState } = useModalContext();

  useModalLimit(3);

  return (
    <DialogPanel className="modal-box">
      <ModalCloseButton />

      {title && <Heading>{title}</Heading>}
      {content && <p>{content}</p>}

      <div className="modal-action">
        <ModalBackButton text="Back" />

        <ModalGenericButton
          text="Goto Modal B"
          onClick={() => {
            insertNextOne(
              BetaModal,
              {
                title: `Branch Modal ${modalState.index + 1}`,
                content: "This modal provides a branching path.",
              } as BetaModalProps,
              true,
            );
          }}
        />
      </div>
    </DialogPanel>
  );
};
export default AlphaModal;
