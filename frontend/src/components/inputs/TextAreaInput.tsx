import clsx from "clsx";
import { FormInputProps } from "../forms/Form";

export const TextAreaInput = (
  props: Omit<FormInputProps, "control" | "componentName" | "rules">,
) => {
  const { name, register, registerOptions, watch, ...rest } = props;
  const required = !!registerOptions?.required;
  const watchedValue = watch(name);
  return (
    <label className={clsx(["form-control relative"])}>
      {required && !watchedValue && (
        <span className={clsx("text-error absolute top-4 left-2.5 text-lg")}>
          *
        </span>
      )}
      <textarea
        className="flex-grow textarea textarea-bordered textarea-lg text-sm"
        {...register(name, registerOptions)}
        {...rest}
      />
    </label>
  );
};

export default TextAreaInput;
