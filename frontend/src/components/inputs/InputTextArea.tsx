import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  RequiredLabel,
  FormError,
} from "@/components/inputs/Input";

export const TextAreaInput = (
  props: Omit<
    AtomicFormComponentProps & ChildFromFormProps,
    "control" | "rules"
  >,
) => {
  const { dataName, displayName, register, watch, errors, input } = props;
  const required = !!input?.registerOpts?.required;
  const watchedValue = watch(dataName);
  const elementProps = {
    ...(input?.element || {}),
    placeholder: input?.element?.placeholder || displayName,
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
        <textarea
          className="flex-grow textarea border border-gray-400/30 textarea-lg text-sm bg-base-300"
          style={{ fieldSizing: "content" }}
          {...register(dataName, registerProps)}
          {...elementProps}
        />
      </label>
      <FormError error={errors} />
    </>
  );
};

export default TextAreaInput;
