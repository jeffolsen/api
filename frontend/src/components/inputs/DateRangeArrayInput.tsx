// import clsx from "clsx";
import { useFieldArray, get, FieldErrors, FieldError } from "react-hook-form";
import {
  CompoundFormComponentProps,
  FromFormProps,
  ChildInputProps,
  FormError,
} from "./Input";
import Button, { XButton } from "../common/Button";
import TextInput, { TextInputProps } from "./TextInput";

function DateRangeSelectInput(
  props: CompoundFormComponentProps & FromFormProps,
) {
  const {
    dataName,
    displayName,
    control,
    register,
    watch,
    errors,
    inputGroup,
  } = props;
  const rules = inputGroup.rules;
  const inputs = inputGroup.inputs;

  const { fields, append, remove } = useFieldArray({
    control,
    name: dataName,
    rules,
  });

  return (
    <>
      <fieldset className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20">
        <legend className="label-text text-sm font-semibold text-neutral-content/70 w-full float-start">
          {displayName}{" "}
        </legend>
        {fields.map((field, index) => (
          <DateRangeEntry
            key={field.id}
            index={index}
            remove={remove}
            register={register}
            errors={errors}
            inputs={inputs as DateRangeInputsProps}
            watch={watch}
            dataName={dataName}
          />
        ))}
        <div>
          <Button
            color="primary"
            onClick={() => {
              append({});
            }}
          >
            +
          </Button>
        </div>
      </fieldset>
      <FormError error={errors?.root as FieldError} />
    </>
  );
}

export type DateRangeInputsProps = {
  startAt: ChildInputProps;
  endAt: ChildInputProps;
  description: ChildInputProps;
};

function DateRangeEntry({
  index,
  remove,
  register,
  watch,
  errors,
  inputs,
  dataName,
  ...props
}: {
  index: number;
  remove: (index: number) => void;
  inputs: DateRangeInputsProps;
} & Omit<
  TextInputProps,
  "control" | "rules" | "displayName" | "input" | "errors"
> & {
    errors: FieldErrors<Record<string, unknown>>;
  }) {
  const startAt = {
    ...(inputs?.startAt || {}),
    dataName: `${dataName}.${index}.${inputs.startAt.dataName}`,
  };
  const startAtError = get(errors?.[index], `${inputs.startAt.dataName}`);
  const endAt = {
    ...(inputs?.endAt || {}),
    dataName: `${dataName}.${index}.${inputs.endAt.dataName}`,
  };
  const endAtError = get(errors?.[index], `${inputs.endAt.dataName}`);
  const description = {
    ...(inputs?.description || {}),
    dataName: `${dataName}.${index}.${inputs.description.dataName}`,
  };
  const descriptionError = get(
    errors?.[index],
    `${inputs.description.dataName}`,
  );

  return (
    <div className="flex gap-4 w-full" {...props}>
      <div className="flex flex-col gap-4 w-full text-neutral-content/70 text-sm">
        <div className="flex gap-4 w-full">
          <TextInput
            register={register}
            errors={startAtError}
            watch={watch}
            {...startAt}
          />
          <TextInput
            register={register}
            errors={endAtError}
            watch={watch}
            {...endAt}
          />
        </div>
        <TextInput
          register={register}
          errors={descriptionError}
          watch={watch}
          {...description}
        />
      </div>
      <div className="flex flex-none self-end h-[48px]">
        <XButton
          className={"relative btn-sm"}
          onClick={() => {
            remove(index);
          }}
        >
          -
        </XButton>
      </div>
    </div>
  );
}

export default DateRangeSelectInput;
