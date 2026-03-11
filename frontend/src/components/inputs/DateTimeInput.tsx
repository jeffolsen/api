import clsx from "clsx";
import { RegisterOptions } from "react-hook-form";
import { FormInputProps } from "../forms/Form";

export const DateTimeInput = (
  props: Omit<FormInputProps, "control" | "componentName" | "rules">,
) => {
  const { name, label, register, registerOptions = {}, watch, ...rest } = props;
  const required = !!registerOptions?.required;
  const watchedValue = watch(name);
  return (
    <label className={clsx(["form-control relative"])}>
      <span className="label-text text-sm font-semibold text-neutral-content/70 flex gap-1">
        {required && !watchedValue && (
          <span className={clsx("text-error text-lg")}>*</span>
        )}
        {label}
      </span>
      <input
        className="input input-bordered text-sm"
        type="datetime-local"
        {...register(`${name}`, {
          ...registerOptions,
          valueAsDate: true,
        } as RegisterOptions)}
        {...rest}
      />
    </label>
  );
};

export default DateTimeInput;
