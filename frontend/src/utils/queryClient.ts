import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { AsyncStorage } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: window.localStorage as unknown as AsyncStorage,
});

export default queryClient;
