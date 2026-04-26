import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FormError,
} from "./Input";
import { TFeed, GetFeedsResponse, useGetFeeds } from "../../network/feed";
import useDebounce from "../../hooks/useDebounce";
import { Plus } from "lucide-react";
import FieldSetWrapperWithMinMax from "../partials/FieldSetWrapper";
import { XButton } from "../common/Button";

type FeedIdField = { id: string; path: TFeed["path"] };

function InputOverrideLink(
  props: Omit<
    AtomicFormComponentProps & ChildFromFormProps,
    "registerOptions" | "componentName"
  >,
) {
  const {
    dataName,
    displayName,
    description,
    watch,
    register,
    setValue,
    errors,
    input,
  } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 3000);
  const geTFeeds = useGetFeeds({
    ...(debouncedSearchTerm && { searchPath: debouncedSearchTerm }),
    subjectTypes: ["COLLECTION"],
    pageSize: 10,
  });
  const feeds = (geTFeeds.data as GetFeedsResponse)?.feeds || [];
  const link = (watch(dataName) as string) || "";
  const registerProps = input?.registerOpts || {};
  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
      >
        <input type="hidden" {...register(dataName, registerProps)} />
        {link?.length > 0 ? (
          <div className="input w-full pl-6 flex items-center border border-gray-400/30 bg-base-300">
            <div className="flex flex-row items-center gap-4 w-full justify-between">
              <span className="truncate max-w-full">{link}</span>
              <XButton
                className={"relative"}
                onClick={() => {
                  setValue?.(dataName, undefined, { shouldDirty: true });
                }}
                size="xs"
              />
            </div>
          </div>
        ) : (
          <Combobox
            onChange={(e: FeedIdField | null) => {
              console.log(e);
              if (e?.path) {
                setSearchTerm("");
                setValue?.(dataName, e.path, { shouldDirty: true });
              }
            }}
          >
            <ComboboxInput
              className="input border-gray-400/50 w-full bg-base-300"
              value={searchTerm}
              placeholder="Search feed path"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ComboboxOptions className="w-[var(--input-width)]">
              {feeds?.map((feed) => (
                <ComboboxOption
                  className="flex items-center gap-2 cursor-pointer rounded px-4 py-3"
                  key={feed.id}
                  value={{
                    id: crypto.randomUUID(),
                    path: feed.path,
                  }}
                >
                  <Plus />
                  <span className="truncate max-w-full">{`/${feed.path}`}</span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        )}
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
    </>
  );
}

export default InputOverrideLink;
