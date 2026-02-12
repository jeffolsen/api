import Heading from "../common/Heading";
import {
  ModalComponentType,
  useModalContext,
  useModalLimit,
} from "../../contexts/ModalContext";
import AlphaModal, { AlphaModalProps } from "./AlphaModal";
import { DialogPanel } from "@headlessui/react";
import { ModalBackButton, ModalGenericButton, ModalNextButton } from "./Modal";

export type BetaModalProps = ModalComponentType & {
  title?: string;
  content?: string;
};

const BetaModal = ({ title, content }: BetaModalProps) => {
  const { insertNextOne, modalState } = useModalContext();

  useModalLimit(3);

  return (
    <DialogPanel className="modal-box">
      {title && <Heading>{title}</Heading>}
      {content && <p>{content}</p>}

      <div className="modal-action">
        <ModalBackButton text="Back" />

        <ModalGenericButton
          text="Goto Modal A"
          onClick={() => {
            insertNextOne(
              AlphaModal,
              {
                title: `Linear Modal ${modalState.index + 1}`,
                content: "This modal lets you advance or exit",
              } as AlphaModalProps,
              true,
            );
          }}
        />

        <ModalNextButton text="Next" />
      </div>
    </DialogPanel>
  );
};
export default BetaModal;
