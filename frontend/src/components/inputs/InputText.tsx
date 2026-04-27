import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  RequiredLabel,
  FormError,
} from "@/components/inputs/Input";

export type TextInputProps = Omit<
  AtomicFormComponentProps & ChildFromFormProps,
  "control" | "rules" | "componentName"
>;

export const TextInput = (props: TextInputProps) => {
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
          className="input border-gray-400/50 flex-grow pl-6 text-sm bg-base-300"
          {...register(dataName, registerProps)}
          {...elementProps}
        />
      </label>
      <FormError error={errors} />
    </>
  );
};

export default TextInput;
