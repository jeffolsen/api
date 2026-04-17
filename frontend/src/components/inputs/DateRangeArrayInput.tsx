// import clsx from "clsx";
import { useFieldArray, get, FieldErrors, FieldError } from "react-hook-form";
import {
  CompoundFormComponentProps,
  FromFormProps,
  ChildInputProps,
  FormError,
  FieldArrayMinMaxRule,
} from "./Input";
import { XButton, PlusButton } from "../common/Button";
import TextInput, { TextInputProps } from "./TextInput";
import { Fragment } from "react";
import { TDateRangeInput } from "../../network/dataRange/types";
import FieldSetWrapperWithMinMax from "./FieldSetWrapper";

function DateRangeSelectInput(
  props: CompoundFormComponentProps & FromFormProps,
) {
  const {
    dataName,
    displayName,
    description,
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

  const rulesProps = rules as FieldArrayMinMaxRule;

  const lastFieldHasMetValidation = () => {
    if (fields.length === 0) return true;
    const lastIndex = fields.length - 1;
    const startAtValue = watch(
      `${dataName}.${lastIndex}.${inputs.startAt.dataName}`,
    );
    const endAtValue = watch(
      `${dataName}.${lastIndex}.${inputs.endAt.dataName}`,
    );
    return !!startAtValue && !!endAtValue && startAtValue < endAtValue;
  };

  const canAppendDateRange = rules
    ? rulesProps?.maxLength?.value
      ? fields.length < rulesProps?.maxLength.value
      : true
    : true;

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
        rules={rulesProps}
      >
        {fields.length > 0 && (
          <div className="flex flex-col items-center gap-8 w-full">
            {fields.map((field, index) => (
              <Fragment key={field.id}>
                <DateRangeEntry
                  index={index}
                  remove={remove}
                  register={register}
                  errors={errors}
                  inputs={inputs as DateRangeInputsProps}
                  watch={watch}
                  dataName={dataName}
                />
                {index !== fields.length - 1 && (
                  <hr className="border-neutral-content/20 w-full" />
                )}
              </Fragment>
            ))}
          </div>
        )}
        {canAppendDateRange && lastFieldHasMetValidation() && (
          <div>
            <PlusButton
              onClick={() => {
                append({} as TDateRangeInput);
              }}
            />
          </div>
        )}
      </FieldSetWrapperWithMinMax>
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
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTimeValue = now.toISOString().slice(0, 16);

  const startAt = {
    ...(inputs?.startAt || {}),
    dataName: `${dataName}.${index}.${inputs.startAt.dataName}`,
    input: {
      ...inputs.startAt.input,
      element: {
        ...inputs.startAt.input.element,
        min: minDateTimeValue,
      },
    },
  };
  const startAtError = get(errors?.[index], `${inputs.startAt.dataName}`);
  const startAtValue = watch(startAt.dataName);

  const endAt = {
    ...(inputs?.endAt || {}),
    dataName: `${dataName}.${index}.${inputs.endAt.dataName}`,
    input: {
      ...inputs.endAt.input,
      element: {
        ...inputs.endAt.input.element,
        min: (startAtValue || minDateTimeValue) as string,
      },
    },
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
      <div className="flex flex-col gap-4 w-full text-neutral-content/80 text-sm">
        <div className="flex flex-wrap gap-4 w-full">
          <div className="flex-1">
            <TextInput
              register={register}
              errors={startAtError}
              watch={watch}
              {...startAt}
            />
          </div>
          <div className="flex-1">
            <TextInput
              register={register}
              errors={endAtError}
              watch={watch}
              {...endAt}
            />
          </div>
        </div>
        <TextInput
          register={register}
          errors={descriptionError}
          watch={watch}
          {...description}
        />
      </div>
      <div className="flex">
        <XButton
          className={"relative btn-xs"}
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
