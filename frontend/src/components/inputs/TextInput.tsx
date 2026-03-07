import clsx from "clsx";
import { FormInputProps } from "../forms/Form";

export const TextInput = (
  props: Omit<FormInputProps, "control" | "componentName" | "rules">,
) => {
  const { name, register, registerOptions, watch, ...rest } = props;
  const required = !!registerOptions?.required;
  const watchedValue = watch(name);
  return (
    <label className={clsx(["form-control relative"])}>
      {required && !watchedValue && (
        <span className={clsx("text-error absolute top-3.5 left-2.5 text-lg")}>
          *
        </span>
      )}
      <input
        className="input input-bordered flex-grow pl-6 text-sm"
        {...register(name, registerOptions)}
        {...rest}
      />
    </label>
  );
};

export default TextInput;
