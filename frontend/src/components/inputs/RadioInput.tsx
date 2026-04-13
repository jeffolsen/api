import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  RequiredLabel,
  FormError,
  SelectableOption,
} from "./Input";
import Tooltip from "../common/Tooltip";

export type RadioInputProps = Omit<
  AtomicFormComponentProps & ChildFromFormProps,
  "control" | "rules" | "componentName"
>;

export const RadioInput = (props: RadioInputProps) => {
  const { dataName, displayName, description, register, watch, errors, input } =
    props;
  const required = !!input?.registerOpts?.required;
  const valueOptions = input?.valueOptions || [];
  const watchedValue = watch(dataName);

  return (
    <>
      <fieldset
        className={clsx([
          "form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20",
        ])}
      >
        <legend
          className={clsx([
            "label-text text-sm font-semibold text-neutral-content/70 w-full float-start",
          ])}
        >
          <span className="flex gap-3 items-center">
            <RequiredLabel
              watchedValue={watchedValue}
              required={required}
              position="absolute"
            />
            {displayName}
            {description && <Tooltip text={description} />}
          </span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {valueOptions?.map((option: SelectableOption) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                className="radio"
                {...register(dataName)}
                type="radio"
                value={option.value}
                checked={watchedValue === option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <FormError error={errors} />
    </>
  );
};

export default RadioInput;
