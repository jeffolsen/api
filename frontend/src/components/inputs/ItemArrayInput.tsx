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
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
  FormError,
} from "./Input";
import { TItem, GetItemsResponse, useGetItems } from "../../network/item";
import { useFieldArray } from "react-hook-form";
import Grid from "../common/Grid";
import useDebounce from "../../hooks/useDebounce";
import { IconButton, XButton } from "../common/Button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

type ItemIdField = { id: string; itemId: TItem["id"]; name: TItem["name"] };
type ItemIdArrayFields = Array<ItemIdField>;

function ItemArrayInput(
  props: Omit<
    AtomicFormComponentProps & ChildFromFormProps,
    "watch" | "registerOptions" | "componentName"
  >,
) {
  const {
    dataName,
    displayName,
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
  const getItems = useGetItems({
    ...(debouncedSearchTerm && { searchName: debouncedSearchTerm }),
    pageSize: 10,
  });
  const items = (getItems.data as GetItemsResponse)?.items || [];

  const getExistingItemQuery = useGetItems({
    ids: (fields as ItemIdArrayFields).map((field) => field.itemId),
  });
  const existingItems = (getExistingItemQuery.data as GetItemsResponse)?.items;

  return (
    <>
      <fieldset className="w-full form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20 text-neutral-content/70">
        <legend className="label-text text-sm font-semibold text-neutral-content/70 w-full float-start">
          {displayName}{" "}
          <FieldArrayMinAndMax
            minLength={(rules as FieldArrayMinMaxRule)?.minLength?.value}
            maxLength={(rules as FieldArrayMinMaxRule)?.maxLength?.value}
          />
        </legend>
        <Grid
          items={(fields as ItemIdArrayFields).map((field, index) => (
            <div
              key={field.id}
              className="relative flex items-center gap-2 border-base-content/20 border rounded px-4 py-3"
            >
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
              <span className="truncate max-w-full mr-6">
                {field.name ||
                  existingItems?.find((item) => item.id === field.itemId)?.name}
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
          onChange={(e: ItemIdField | null) => {
            if (e) {
              append(e);
              setSearchTerm("");
            }
          }}
        >
          <ComboboxInput
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ComboboxOptions className="w-[var(--input-width)]">
            {items?.map((item) => (
              <ComboboxOption
                className="flex items-center gap-2 cursor-pointer rounded px-4 py-3"
                key={item.id}
                value={{
                  id: crypto.randomUUID(),
                  itemId: item.id,
                  name: item.name,
                }}
              >
                <Plus />
                <span className="truncate max-w-full">{item.name}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </fieldset>
      <FormError error={errors} />
    </>
  );
}

export default ItemArrayInput;
