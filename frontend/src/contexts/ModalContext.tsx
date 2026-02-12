import { createContext, ElementType, useContext } from "react";

export type ModalComponentType<P = object> = ElementType<P>;

export interface ModalItem<P = object> {
  id: string;
  component: ModalComponentType<P>;
  props?: P;
}

export interface ModalState {
  queue: ModalItem[];
  index: number;
  lastIndex: number;
  lastUpdated: Date | null;
}

export type ShouldEnqueueOptions = {
  enqueueOnlyIfEmpty?: boolean;
  delayUntilAfterLastEnqueued?: number;
  delayUntilCookieExpires?: {
    name: string;
    daysUntilExpire: number;
  };
};

export interface ModalContextType {
  shouldEnqueue: (options: ShouldEnqueueOptions, batchSize?: number) => boolean;
  enqueueModals: <P>(
    modals: {
      component: ModalComponentType<P>;
      props?: P;
      options?: ShouldEnqueueOptions;
    }[],
  ) => void;
  closeAllModals: () => void;
  openNextModal: () => void;
  openPrevModal: () => void;
  insertNextOne: <P>(
    component: ModalComponentType<P>,
    props?: P,
    open?: boolean,
  ) => void;
  removeCurrent: () => void;
  removeNextOne: () => void;
  removeAllPrev: () => void;
  removeAllNext: () => void;

  modalState: ModalState;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const useModalLimit = (limit: number) => {
  const { modalState, removeAllPrev } = useModalContext();

  const { index, lastIndex } = modalState;

  if (index > limit && lastIndex > limit) {
    removeAllPrev();
  }
};
