import { useFieldArray } from "react-hook-form";
import { TTagName, useGetTags } from "@/network/tag";
import Grid from "@/components/common/Grid";
import { useCallback } from "react";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FieldArrayMinMaxRule,
  FormError,
} from "@/components/inputs/Input";
import clsx from "clsx";
import Loading from "@/components/common/Loading";
import { TTagInput } from "@/network/tag";
import FieldSetWrapperWithMinMax from "@/components/partials/FieldSetWrapper";

type TagnameArrayFields = Array<TTagInput & { id: string }>;

function TagArrayInput(
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: dataName,
    rules,
  });
  const tags = useGetTags();

  const selectedTagnames = (fields as TagnameArrayFields).map((f) => f.name);

  const handleToggle = (tagname: TTagName) => {
    const index = selectedTagnames.indexOf(tagname);
    if (index !== -1) {
      remove(index);
    } else {
      append({ name: tagname });
    }
  };

  const getTags = useCallback(() => {
    if (tags.data?.tags) {
      return tags.data.tags.sort((a: TTagInput, b: TTagInput) =>
        a.name.localeCompare(b.name),
      );
    }
    return [];
  }, [tags.data]);

  const canSelectTags =
    ((rules as FieldArrayMinMaxRule)?.minLength?.value || 0) +
      selectedTagnames.length <
    ((rules as FieldArrayMinMaxRule)?.maxLength?.value || Infinity);

  if (tags.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
        rules={rules as FieldArrayMinMaxRule}
      >
        <Grid
          columns={{ base: "2", sm: "3", md: "4" }}
          items={getTags().map((tag: TTagInput) => (
            <TagCheckbox
              key={tag.name}
              tag={tag}
              isChecked={selectedTagnames.includes(tag.name)}
              isDisabled={
                !selectedTagnames.includes(tag.name) && !canSelectTags
              }
              onChange={handleToggle}
            />
          ))}
        />
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
    </>
  );
}

const TagCheckbox = ({
  tag,
  isChecked,
  isDisabled,
  onChange,
}: {
  tag: TTagInput;
  isChecked: boolean;
  isDisabled: boolean;
  onChange: (tagname: TTagName) => void;
}) => {
  return (
    <label key={tag.name} className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={clsx(
          "checkbox bg-base-300",
          !isChecked && isDisabled
            ? "checkbox-disabled"
            : !isChecked
              ? "checkbox-neutral"
              : "checkbox-primary",
        )}
        checked={isChecked}
        onChange={() => onChange(tag.name)}
        disabled={!isChecked && isDisabled}
      />
      <span>{tag.name}</span>
    </label>
  );
};

export default TagArrayInput;
