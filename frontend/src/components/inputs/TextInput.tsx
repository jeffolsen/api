import clsx from "clsx";
import {
  AtomicFormComponentProps,
  FromFormProps,
  RequiredLabel,
  FormError,
} from "./Input";

export const TextInput = (
  props: Omit<AtomicFormComponentProps & FromFormProps, "control" | "rules">,
) => {
  const { dataName, displayName, register, watch, errors, input } = props;
  const required = !!input?.registerOpts?.required;
  const watchedValue = watch(dataName);
  const elementProps = {
    ...(input?.element || {}),
    placeholder: input?.element?.placeholder || displayName,
    type: input?.element?.type || "text",
  };
  const registerProps = input?.registerOpts || {};
  return (
    <>
      <label className={clsx(["form-control relative"])}>
        <RequiredLabel
          watchedValue={watchedValue}
          required={required}
          position="absolute"
        />
        <input
          className="input input-bordered flex-grow pl-6 text-sm"
          {...register(dataName, registerProps)}
          {...elementProps}
        />
      </label>
      <FormError error={errors[dataName]} />
    </>
  );
};

export default TextInput;
