import { useFieldArray } from "react-hook-form";
import { TTagName, useGetTags } from "../../network/tag";
import Grid from "../common/Grid";
import { useCallback } from "react";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
  FormError,
} from "./Input";
import clsx from "clsx";
import Loading from "../common/Loading";
import { TTagInput } from "../../network/tag";

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
      <fieldset className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20 text-neutral-content/70">
        <legend className="label-text text-sm font-semibold text-neutral-content/70 w-full float-start">
          {displayName}{" "}
          <FieldArrayMinAndMax
            minLength={(rules as FieldArrayMinMaxRule)?.minLength?.value}
            maxLength={(rules as FieldArrayMinMaxRule)?.maxLength?.value}
          />
        </legend>
        <Grid
          columns={{ base: "2", sm: "3", md: "4" }}
          items={getTags().map((tag: TTagInput) => (
            <label
              key={tag.name}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className={clsx(
                  "checkbox",
                  !selectedTagnames.includes(tag.name) && !canSelectTags
                    ? "checkbox-disabled"
                    : !selectedTagnames.includes(tag.name)
                      ? "checkbox-neutral"
                      : "checkbox-primary",
                )}
                checked={selectedTagnames.includes(tag.name)}
                onChange={() => handleToggle(tag.name)}
                disabled={
                  !selectedTagnames.includes(tag.name) && !canSelectTags
                }
              />
              <span>{tag.name}</span>
            </label>
          ))}
        />
      </fieldset>
      <FormError error={errors} />
    </>
  );
}

export default TagArrayInput;
