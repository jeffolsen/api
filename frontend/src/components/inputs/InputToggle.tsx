import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  RequiredLabel,
  FormError,
} from "@/components/inputs/Input";
import Tooltip from "@/components/common/Tooltip";

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
          "border border-gray-400/50 rounded p-4 pl-6 text-sm shadow-xl",
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
          className="toggle shadow-base-300"
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
