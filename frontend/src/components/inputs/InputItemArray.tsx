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
  FieldArrayMinMaxRule,
  FormError,
} from "@/components/inputs/Input";
import { TItem, GetItemsResponse, useGetItems } from "@/network/item";
import { useFieldArray } from "react-hook-form";
import Grid from "@/components/common/Grid";
import useDebounce from "@/hooks/useDebounce";
import { Plus } from "lucide-react";
import ComponentSchemaArrayOrderable from "@/components/partials/ComponentSchemaArrayOrderable";
import FieldSetWrapperWithMinMax from "@/components/partials/FieldSetWrapper";

type ItemIdField = { id: string; slug: TItem["slug"]; name: TItem["name"] };
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
  const getItems = useGetItems({
    ...(debouncedSearchTerm && { searchName: debouncedSearchTerm }),
    pageSize: 10,
  });
  const items = (getItems.data as GetItemsResponse)?.items || [];

  const getExistingItemQuery = useGetItems({
    slugs: (fields as ItemIdArrayFields).map((field) => field.slug),
  });
  const existingItems = (getExistingItemQuery.data as GetItemsResponse)?.items;

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
        rules={rules as FieldArrayMinMaxRule}
      >
        <Grid
          items={(fields as ItemIdArrayFields).map((field, index) => {
            return {
              content: (
                <ComponentSchemaArrayOrderable
                  key={field.id}
                  label={
                    field.name ||
                    (existingItems?.find((item) => item.slug === field.slug)
                      ?.name as string)
                  }
                  fields={fields}
                  index={index}
                  remove={remove}
                  swap={swap}
                />
              ),
              id: field.id,
            };
          })}
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
            className="input border-gray-400/50 w-full bg-base-300"
            value={searchTerm}
            placeholder="Search item names"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ComboboxOptions className="w-[var(--input-width)]">
            {items?.map((item) => (
              <ComboboxOption
                className="flex items-center gap-2 cursor-pointer rounded px-4 py-3"
                key={item.slug}
                value={{
                  id: crypto.randomUUID(),
                  slug: item.slug,
                  name: item.name,
                }}
              >
                <Plus />
                <span className="truncate max-w-full">{item.name}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
    </>
  );
}

export default ItemArrayInput;
