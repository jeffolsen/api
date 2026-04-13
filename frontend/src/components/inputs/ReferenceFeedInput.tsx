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
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
  FormError,
} from "./Input";
import { TFeed, GetFeedsResponse, useGetFeeds } from "../../network/feed";
import { useFieldArray } from "react-hook-form";
import Grid from "../common/Grid";
import useDebounce from "../../hooks/useDebounce";
import { IconButton, XButton } from "../common/Button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Tooltip from "../common/Tooltip";

type FeedIdField = { id: string; feedId: TFeed["id"]; path: TFeed["path"] };
type feedIdArrayFields = Array<FeedIdField>;

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
    ids: (fields as feedIdArrayFields).map((field) => field.feedId),
  });
  const existingFeeds = (getExistingFeedQuery.data as GetFeedsResponse)?.feeds;

  const canAddMore = useMemo(() => {
    const maxLength = (rules as FieldArrayMinMaxRule)?.maxLength?.value;
    const check = !maxLength || maxLength > fields.length;
    return check;
  }, [fields.length, rules]);

  return (
    <>
      <fieldset className="w-full form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20 text-neutral-content/70">
        <legend className="label-text text-sm font-semibold text-neutral-content/70 w-full float-start flex items-center gap-3">
          {displayName}{" "}
          <FieldArrayMinAndMax
            minLength={(rules as FieldArrayMinMaxRule)?.minLength?.value}
            maxLength={(rules as FieldArrayMinMaxRule)?.maxLength?.value}
          />
          {description && <Tooltip text={description} />}
        </legend>
        <Grid
          items={(fields as feedIdArrayFields).map((field, index) => (
            <div
              key={field.id}
              className="relative flex items-center gap-2 border-base-content/20 border rounded px-4 py-3"
            >
              {fields.length > 1 && (
                <div className="flex flex-col gap-2">
                  <IconButton
                    disabled={index === 0}
                    onClick={() => swap(index, Math.max(0, index - 1))}
                    size="xs"
                  >
                    <ChevronUp />
                  </IconButton>
                  <IconButton
                    disabled={index === fields.length - 1}
                    onClick={() =>
                      swap(index, Math.min(index + 1, fields.length - 1))
                    }
                    size="xs"
                  >
                    <ChevronDown />
                  </IconButton>
                </div>
              )}
              <span className="truncate max-w-full mr-6">
                {`/${
                  field.path ||
                  existingFeeds?.find((f) => f.id === field.feedId)?.path
                }
                /:id`}
              </span>
              <XButton
                onClick={() => {
                  remove(index);
                }}
                size="xs"
              />
            </div>
          ))}
        />
        <Combobox
          onChange={(e: FeedIdField | null) => {
            if (e) {
              append(e);
              setSearchTerm("");
            }
          }}
        >
          {canAddMore && (
            <ComboboxInput
              className="input input-bordered w-full"
              value={searchTerm}
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
                  feedId: feed.id,
                  name: feed.path,
                }}
              >
                <Plus />
                <span className="truncate max-w-full">{`/${feed.path}/:id`}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </fieldset>
      <FormError error={errors} />
    </>
  );
}

export default ReferenceFeedInput;
