import { useModalContext } from "../../contexts/ModalContext";
import { HeadingLevelProvider } from "../common/Heading";
import { Dialog } from "@headlessui/react";
import { PropsWithChildren } from "react";

const ModalManager = () => {
  const { modalState, closeAllModals } = useModalContext();
  const { queue, index } = modalState;
  const activeModal = queue[index];

  if (!activeModal) return null;

  const { component: ModalComponent, props } = activeModal;

  return (
    <Modal onClick={() => closeAllModals()}>
      <HeadingLevelProvider>
        <ModalComponent {...props} />
      </HeadingLevelProvider>
    </Modal>
  );
};

function Modal({
  onClick,
  children,
}: PropsWithChildren & { onClick: () => void }) {
  return (
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <div
        className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        onClick={onClick}
      >
        {children}
      </div>
    </Dialog>
  );
}

const ModalCloseButton = () => {
  const { closeAllModals } = useModalContext();
  return (
    <button
      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      onClick={() => {
        closeAllModals();
      }}
    >
      ✕
    </button>
  );
};

interface ModalBackButtonProps {
  text: string;
}

const ModalBackButton = ({ text = "back" }: ModalBackButtonProps) => {
  const { removeCurrent, modalState } = useModalContext();
  const { index } = modalState;
  return (
    <>
      {index > 0 && (
        <button
          className="btn"
          onClick={() => {
            removeCurrent();
          }}
        >
          {text}
        </button>
      )}
    </>
  );
};

interface ModalNextButtonProps {
  text: string;
}

const ModalNextButton = ({ text = "next" }: ModalNextButtonProps) => {
  const { openNextModal, modalState } = useModalContext();
  const { index, queue } = modalState;
  return (
    <>
      {index < queue.length - 1 && (
        <button
          className="btn"
          onClick={() => {
            openNextModal();
          }}
        >
          {text}
        </button>
      )}
    </>
  );
};

interface ModalGenericButtonProps {
  text: string;
  onClick: () => void;
}

const ModalGenericButton = ({ text, onClick }: ModalGenericButtonProps) => {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
};

export {
  ModalCloseButton,
  ModalBackButton,
  ModalNextButton,
  ModalGenericButton,
};

export default ModalManager;
