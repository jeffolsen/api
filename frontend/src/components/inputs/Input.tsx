import { InputHTMLAttributes } from "react";
import {
  RegisterOptions,
  UseFieldArrayProps,
  UseFormRegister,
  Control,
  FieldErrors,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";
import clsx from "clsx";
import Text from "../common/Text";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import TagArrayInput from "./TagArrayInput";
import ImageSelectArrayInput from "./ImageSelectArrayInput";

export type FromFormProps = {
  control: Control;
  register: UseFormRegister<Record<string, unknown>>;
  watch: (field: string) => unknown;
  errors: FieldErrors<{
    [x: string]: unknown;
  }>;
};

export type AtomicFormComponentName =
  | "Subheading"
  | "TextInput"
  | "TextAreaInput"
  | "DateTimeInput"
  | "CheckboxInput"
  | "ImageSelectArrayInput"
  | "TagArrayInput";

export type CompoundFormComponentName = "DateRangeArrayInput";

export type FormInputProps = {
  element?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
  registerOpts?: RegisterOptions;
  rules?: UseFieldArrayProps["rules"];
};

export type FormSectionProps = {
  dataName: string;
  displayName: string;
};

export type AtomicFormComponentProps = {
  componentName: AtomicFormComponentName;
  input: FormInputProps;
} & FormSectionProps;
export type CompoundFormComponentProps = {
  componentName: CompoundFormComponentName;
  inputGroup: {
    inputs: Record<string, FormInputProps & FormSectionProps>;
    rules?: UseFieldArrayProps["rules"];
  };
} & FormSectionProps;

export type FormComponentProps =
  | AtomicFormComponentProps
  | CompoundFormComponentProps;

const FormSubheading = ({ displayName }: { displayName: string }) => {
  return (
    <div className="flex gap-2 items-center pl-4">
      <Text
        textSize="md"
        className="sm:flex-none uppercase text-left text-neutral-content/70"
      >
        {displayName}
      </Text>
      <hr className="border-neutral-content/20 flex-1 hidden sm:block" />
    </div>
  );
};

export const FormInput = (props: FormComponentProps & FromFormProps) => {
  const { displayName, componentName } = props;
  return componentName === "Subheading" ? (
    <FormSubheading displayName={displayName} />
  ) : componentName === "TextInput" ? (
    <TextInput {...props} />
  ) : componentName === "TextAreaInput" ? (
    <TextAreaInput {...props} />
  ) : componentName === "ImageSelectArrayInput" ? (
    <ImageSelectArrayInput {...props} />
  ) : componentName === "TagArrayInput" ? (
    <TagArrayInput {...props} />
  ) : (
    // : componentName === "DateRangeSelectInput" ? (
    //   <DateRangeSelectInput {...props} />
    // )
    <p>Unsupported input type</p>
  );
};

type FormErrorProps = {
  error: Merge<FieldError, FieldErrorsImpl<object>> | undefined;
};

export const FormError = ({ error }: FormErrorProps) => {
  if (error?.root) {
    return (
      <div className={clsx(["px-4 py-2 mt-1", "bg-error text-error-content"])}>
        {error.root.message}
      </div>
    );
  }
  return (
    <>
      {error && (
        <div
          className={clsx(["px-4 py-2 mt-1", "bg-error text-error-content"])}
        >
          {error.message}
        </div>
      )}
    </>
  );
};

export type RequiredLabelProps = {
  required: boolean;
  watchedValue: unknown;
  position?: "absolute" | "relative";
};

export const RequiredLabel = ({
  required,
  watchedValue,
  position = "relative",
}: RequiredLabelProps) => {
  return (
    <>
      {required && !watchedValue && (
        <span
          className={clsx(
            "text-error text-lg",
            position === "absolute" && "absolute top-3.5 left-2.5",
          )}
        >
          *
        </span>
      )}
    </>
  );
};

type FieldArrayMinMaxProps = {
  minLength?: number;
  maxLength?: number;
};

export type FieldArrayMinMaxRule = {
  minLength?: { value: number };
  maxLength?: { value: number };
};

export const FieldArrayMinAndMax = ({
  minLength,
  maxLength,
}: FieldArrayMinMaxProps) => {
  const min = minLength || 0;
  const max = maxLength || Infinity;

  if (min === 0 && max === Infinity) {
    return null;
  }
  if (min === max) {
    return <>{`(select ${min})`}</>;
  }
  if (max === Infinity) {
    return <>{`(select at least ${min})`}</>;
  }
  if (min === 0) {
    return <>{`(select up to ${max})`}</>;
  }
  return <>{`(select between ${min} and ${max})`}</>;
};

export default FormInput;
