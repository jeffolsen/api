import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  RequiredLabel,
  FormError,
} from "./Input";
import Tooltip from "../common/Tooltip";

export type ToggleInputProps = Omit<
  AtomicFormComponentProps & ChildFromFormProps,
  "control" | "rules" | "componentName"
>;

export const ToggleInput = (props: ToggleInputProps) => {
  const { dataName, displayName, description, register, watch, errors, input } =
    props;
  const required = !!input?.registerOpts?.required;
  const watchedValue = watch(dataName);
  const elementProps = { ...input?.element };
  const registerProps = input?.registerOpts || {};

  return (
    <>
      <label
        className={clsx([
          "form-control relative flex flex-row items-center gap-4 w-full justify-between",
          "border rounded p-4 pl-6 border-base-content/20 text-neutral-content/80 text-sm",
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
        <input
          className="toggle"
          {...register(dataName, registerProps)}
          {...elementProps}
          type="checkbox"
        />
      </label>
      <FormError error={errors} />
    </>
  );
};

export default ToggleInput;
