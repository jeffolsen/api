import { useFieldArray } from "react-hook-form";
import {
  FormInputProps,
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
} from "../forms/Form";
import { useGetTags } from "../../network/tag";
import Grid from "../common/Grid";
import { useCallback } from "react";

type TagnameField = {
  id: string;
  tagname: string;
};

type Tag = {
  name: string;
};

type TagnameArrayFields = Array<TagnameField>;

function TagArrayInput(
  props: Omit<FormInputProps, "watch" | "registerOptions" | "componentName">,
) {
  const { name, control, rules } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });
  const tags = useGetTags();

  const selectedTagnames = (fields as TagnameArrayFields).map((f) => f.tagname);

  const handleToggle = (tagname: string) => {
    const index = selectedTagnames.indexOf(tagname);
    if (index !== -1) {
      remove(index);
    } else {
      append({ tagname });
    }
  };

  const getTags = useCallback(() => {
    if (tags.data) {
      return tags.data.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name));
    }
    return [];
  }, [tags.data]);

  return (
    <fieldset className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20">
      <span className="label-text text-sm font-semibold text-neutral-content/70 w-full">
        Tags{" "}
        <FieldArrayMinAndMax
          minLength={(rules as FieldArrayMinMaxRule)?.minLength?.value}
          maxLength={(rules as FieldArrayMinMaxRule)?.maxLength?.value}
        />
      </span>
      <Grid
        columns={{ base: "2", sm: "3", md: "4" }}
        items={getTags().map((tag: { name: string }) => (
          <label
            key={tag.name}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={selectedTagnames.includes(tag.name)}
              onChange={() => handleToggle(tag.name)}
            />
            <span>{tag.name}</span>
          </label>
        ))}
      />
    </fieldset>
  );
}

export default TagArrayInput;
