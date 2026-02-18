import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  ModalComponentType,
  ModalItem,
  ModalContextType,
  ModalState,
  ModalContext,
  ShouldEnqueueOptions,
} from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    queue: [],
    index: 0,
    lastIndex: 0,
    lastUpdated: null,
  });

  useEffect(() => {
    console.log(modalState);
  }, [modalState]);

  const cookieNamePrefix = "modal-";

  const writeCookie = (options: ShouldEnqueueOptions) => {
    const { delayUntilCookieExpires } = options;
    if (delayUntilCookieExpires) {
      const { name, daysUntilExpire } = delayUntilCookieExpires;
      const expires = new Date();
      expires.setTime(
        expires.getTime() + daysUntilExpire * 24 * 60 * 60 * 1000,
      );
      document.cookie = `${cookieNamePrefix}${name}=${false}; expires=${expires.toUTCString()};`;
    }
  };

  const shouldEnqueue = useCallback(
    (options: ShouldEnqueueOptions, batchSize?: number) => {
      const {
        enqueueOnlyIfEmpty,
        delayUntilAfterLastEnqueued,
        delayUntilCookieExpires,
      } = options;
      const { queue, lastUpdated } = modalState;
      if (
        enqueueOnlyIfEmpty &&
        ((batchSize && batchSize > 0) || queue.length > 0)
      ) {
        return false;
      }
      if (delayUntilAfterLastEnqueued && lastUpdated) {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdated.getTime();
        if (timeSinceLastUpdate < delayUntilAfterLastEnqueued) {
          return false;
        }
      }
      if (delayUntilCookieExpires) {
        const { name } = delayUntilCookieExpires;
        const existingCookie = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith(`${cookieNamePrefix}${name}=`));
        if (existingCookie) {
          return false;
        }
      }
      return true;
    },
    [modalState],
  );

  const enqueueModals = useCallback(
    <P extends object>(
      modals: {
        component: ModalComponentType<P>;
        props?: P;
        options?: ShouldEnqueueOptions;
      }[],
    ) => {
      let countEnqueued = 0;
      const newQueue: ModalItem[] = [];
      modals.forEach(({ component, props, options }) => {
        if (options && !shouldEnqueue(options, countEnqueued)) {
          return;
        }
        const newModal: ModalItem<P> = {
          id: crypto.randomUUID(),
          component,
          props,
        };
        newQueue.push(newModal as ModalItem);
        countEnqueued += 1;
        if (options) {
          writeCookie(options);
        }
      });
      setModalState((prevState) => {
        const { queue, index, lastIndex, lastUpdated } = prevState;
        return {
          queue: [...queue, ...newQueue] as ModalItem[],
          index,
          lastIndex,
          lastUpdated,
        };
      });
    },
    [shouldEnqueue],
  );

  const insertNextOne = useCallback(
    <P extends object>(
      component: ModalComponentType<P>,
      props?: P,
      open?: boolean,
    ) => {
      const newModal: ModalItem<P> = {
        id: crypto.randomUUID(),
        component,
        props,
      };
      setModalState((prevState) => {
        const { queue, index, lastUpdated } = prevState;
        const newQueue = [...queue];
        newQueue.splice(index + 1, 0, newModal as ModalItem);
        return {
          queue: newQueue as ModalItem[],
          index: open ? index + 1 : index,
          lastIndex: index,
          lastUpdated,
        };
      });
    },
    [],
  );

  const removeNextOne = useCallback(() => {
    setModalState((prevState) => {
      const { queue, index, lastIndex, lastUpdated } = prevState;
      const newQueue = [...queue];
      const nextIndex = index + 1;
      if (nextIndex < newQueue.length && lastIndex !== index) {
        newQueue.splice(nextIndex, 1);
      }
      return {
        queue: newQueue as ModalItem[],
        index,
        lastIndex: index,
        lastUpdated,
      };
    });
  }, []);

  const removeCurrent = useCallback((confirm?: string) => {
    if (confirm && !window.confirm(confirm)) {
      return;
    }
    setModalState((prevState) => {
      const { queue, index, lastUpdated } = prevState;
      if (index === 0) {
        return prevState;
      }
      const newQueue = [...queue];
      newQueue.splice(index, 1);
      return {
        queue: newQueue as ModalItem[],
        index: index - 1,
        lastIndex: index - 1,
        lastUpdated,
      };
    });
  }, []);

  const removePrev = useCallback((buffer = 0) => {
    setModalState((prevState) => {
      const { queue, index, lastIndex, lastUpdated } = prevState;
      if (index === 0) return { queue, index, lastIndex, lastUpdated };
      const newQueue = [...queue];
      const bufferIndex = Math.max(0, index - buffer);
      return {
        queue: newQueue.slice(bufferIndex),
        index: buffer,
        lastIndex: buffer,
        lastUpdated,
      };
    });
  }, []);

  const closeAllModals = useCallback((confirm?: string) => {
    if (confirm && !window.confirm(confirm)) {
      return;
    }
    setModalState({
      queue: [],
      index: 0,
      lastIndex: 0,
      lastUpdated: new Date(),
    });
  }, []);

  const openNextModal = useCallback(() => {
    setModalState((prevState) => {
      const { queue, index, lastUpdated } = prevState;
      const nextIndex = Math.min(queue.length - 1, index + 1);
      const lastIndex = index;
      return { queue, index: nextIndex, lastIndex, lastUpdated };
    });
  }, []);

  const openPrevModal = useCallback(() => {
    setModalState((prevState) => {
      const { queue, index, lastUpdated } = prevState;
      const nextIndex = Math.max(0, index - 1);
      const lastIndex = index;
      return { queue, index: nextIndex, lastIndex, lastUpdated };
    });
  }, []);

  const value = {
    modalState,
    enqueueModals,
    openPrevModal,
    openNextModal,
    closeAllModals,
    insertNextOne,
    removeNextOne,
    removeCurrent,
    removePrev,
  } as ModalContextType;

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
