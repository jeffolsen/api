import clsx, { ClassValue } from "clsx";
import { useModalContext } from "../../contexts/ModalContext";
import { Button } from "../common/Button";
import { HeadingLevelProvider } from "../common/Heading";
import { Dialog, DialogPanel } from "@headlessui/react";
import { PropsWithChildren } from "react";

const ModalManager = () => {
  const { modalState } = useModalContext();
  const { queue, index } = modalState;
  const activeModal = queue[index];

  if (!activeModal) return null;

  const { component: ModalComponent, props } = activeModal;

  return (
    <HeadingLevelProvider>
      <ModalComponent {...props} />
    </HeadingLevelProvider>
  );
};

export type ModalProps = {
  closeConfirm?: string;
  onClose?: () => void;
  modalStyles?: ClassValue;
  backgroundStyles?: ClassValue;
};

export function Modal({
  closeConfirm,
  onClose,
  modalStyles,
  backgroundStyles,
  children,
}: PropsWithChildren<ModalProps>) {
  const { closeAllModals } = useModalContext();
  return (
    <Dialog open={true} onClose={() => onClose?.()} className="relative z-50">
      <div
        className={clsx(
          "fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/30 backdrop-blur-sm",
          backgroundStyles,
        )}
        onClick={() => closeAllModals(closeConfirm)}
      >
        <DialogPanel
          className={clsx("modal-box flex flex-col gap-6", modalStyles)}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface ModalCloseXButtonProps {
  confirm?: string;
}

const ModalCloseXButton = ({ confirm }: ModalCloseXButtonProps) => {
  const { closeAllModals } = useModalContext();
  return (
    <Button
      size="xs"
      className="btn-circle btn-ghost absolute right-2 top-2"
      onClick={() => {
        closeAllModals(confirm);
      }}
    >
      ✕
    </Button>
  );
};

interface ModalCloseButtonProps {
  text?: string;
  confirm?: string;
}

const ModalCloseButton = ({
  text = "close",
  confirm,
}: ModalCloseButtonProps) => {
  const { closeAllModals } = useModalContext();
  return (
    <Button
      color="primary"
      size="md"
      onClick={() => {
        closeAllModals(confirm);
      }}
    >
      {text}
    </Button>
  );
};

interface ModalBackButtonProps {
  text: string;
  confirm?: string;
}

const ModalBackButton = ({ text = "back", confirm }: ModalBackButtonProps) => {
  const { removeCurrent, modalState } = useModalContext();
  const { index } = modalState;
  return (
    <>
      {index > 0 && (
        <Button
          onClick={() => {
            removeCurrent(confirm);
          }}
        >
          {text}
        </Button>
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
        <Button
          onClick={() => {
            openNextModal();
          }}
        >
          {text}
        </Button>
      )}
    </>
  );
};

interface ModalGenericButtonProps {
  text: string;
  onClick: () => void;
}

const ModalGenericButton = ({ text, onClick }: ModalGenericButtonProps) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export {
  ModalCloseXButton,
  ModalCloseButton,
  ModalBackButton,
  ModalNextButton,
  ModalGenericButton,
};

export default ModalManager;
