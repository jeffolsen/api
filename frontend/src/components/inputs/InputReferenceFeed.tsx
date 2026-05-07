import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FieldArrayMinMaxRule,
  FormError,
} from "@/components/inputs/Input";
import { TFeed, GetFeedsResponse } from "@/network/feed/types";
import { useGetFeeds } from "@/network/feed/useGetFeeds";
import { useFieldArray } from "react-hook-form";
import Grid from "@/components/common/Grid";
import useDebounce from "@/hooks/useDebounce";
import { Plus } from "lucide-react";
import ComponentSchemaArrayOrderable from "@/components/partials/ComponentSchemaArrayOrderable";
import FieldSetWrapperWithMinMax from "@/components/partials/FieldSetWrapper";

type FeedPathField = { id: string; path: TFeed["path"] };
type FeedPathArrayFields = Array<FeedPathField>;

function ReferenceFeedInput(
  props: Omit<
    AtomicFormComponentProps & ChildFromFormProps,
    "watch" | "registerOptions" | "componentName"
  >,
) {
  const {
    dataName,
    displayName,
    description,
    control,
    errors,
    input: { rules },
  } = props;
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: dataName,
    rules,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 3000);
  const geTFeeds = useGetFeeds({
    ...(debouncedSearchTerm && { searchPath: debouncedSearchTerm }),
    subjectTypes: ["SINGLE"],
    pageSize: 10,
  });
  const feeds = (geTFeeds.data as GetFeedsResponse)?.feeds || [];

  const getExistingFeedQuery = useGetFeeds({
    paths: (fields as FeedPathArrayFields).map((field) => field.path),
  });
  const existingFeeds = (getExistingFeedQuery.data as GetFeedsResponse)?.feeds;

  const canAddMore = useMemo(() => {
    const maxLength = (rules as FieldArrayMinMaxRule)?.maxLength?.value;
    const check = !maxLength || maxLength > fields.length;
    return check;
  }, [fields.length, rules]);

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
        rules={rules as FieldArrayMinMaxRule}
      >
        <Grid
          items={(fields as FeedPathArrayFields).map((field, index) => (
            <ComponentSchemaArrayOrderable
              key={field.id}
              label={`/${
                field.path ||
                existingFeeds?.find((f) => f.path === field.path)?.path
              }/:id`}
              fields={fields}
              index={index}
              remove={remove}
              swap={swap}
            />
          ))}
        />
        <Combobox
          onChange={(e: FeedPathField | null) => {
            if (e) {
              append(e);
              setSearchTerm("");
            }
          }}
        >
          {canAddMore && (
            <ComboboxInput
              className="input border-gray-400/50 w-full bg-base-300"
              value={searchTerm}
              placeholder="Search feed paths"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <ComboboxOptions className="w-[var(--input-width)]">
            {feeds?.map((feed) => (
              <ComboboxOption
                className="flex items-center gap-2 cursor-pointer rounded px-4 py-3"
                key={feed.id}
                value={{
                  id: crypto.randomUUID(),
                  path: feed.path,
                  name: feed.path,
                }}
              >
                <Plus />
                <span className="truncate max-w-full">{`/${feed.path}/:id`}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
    </>
  );
}

export default ReferenceFeedInput;
