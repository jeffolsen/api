import { PropsWithChildren, Dispatch, SetStateAction } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import clsx, { ClassValue } from "clsx";
import { HeadingLevelProvider } from "../common/Heading";
import { XButton } from "../common/Button";

// TODO: Implement ModalContext to prevent multiple modals
// from being open at the same time and to allow for nested modals.
// Move open state and close function to context.

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  closeConfirm?: string;
  onClose?: () => void;
  modalStyles?: ClassValue;
  backgroundStyles?: ClassValue;
};

export default function Modal({
  children,
  isOpen = false,
  setIsOpen,
  onClose,
  closeConfirm,
  modalStyles,
  backgroundStyles,
}: PropsWithChildren<ModalProps>) {
  const close = () => {
    if (closeConfirm && !window.confirm(closeConfirm)) return;
    onClose?.();
    setIsOpen(false);
  };

  return (
    <HeadingLevelProvider>
      <Dialog open={isOpen} onClose={close}>
        <div
          className={clsx(
            "fixed inset-0 flex w-screen z-40 items-center justify-center bg-black/30 backdrop-blur-sm",
            backgroundStyles,
          )}
          onClick={close}
        >
          <DialogPanel
            className={clsx(
              "modal-box flex flex-col gap-6 w-full max-w-2xl max-h-screen",
              "bg-base-100 border-t border-t-gray-400/30 text-base-content",
              modalStyles,
            )}
          >
            <XButton onClick={close} />

            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </HeadingLevelProvider>
  );
}
