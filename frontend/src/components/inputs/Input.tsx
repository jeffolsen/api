import { InputHTMLAttributes } from "react";
import {
  RegisterOptions,
  UseFieldArrayProps,
  UseFormRegister,
  Control,
  FieldErrors,
  FieldError,
  UseFormSetValue,
  FieldValues,
  get,
} from "react-hook-form";
import clsx from "clsx";
import Text from "../common/Text";
import Inputs from "./LazyInputs";
import { Suspense } from "react";

export type FromFormProps = {
  control: Control;
  register: UseFormRegister<Record<string, unknown>>;
  setValue?: UseFormSetValue<FieldValues>;
  watch: (field: string) => unknown;
  errors: FieldErrors<{
    [x: string]: unknown;
  }>;
};

// Props for child input components that receive a pre-extracted single field error
export type ChildFromFormProps = Omit<FromFormProps, "errors"> & {
  errors: FieldError | undefined;
};

export type DecorativeFormComponentName = "Subheading";

export type AtomicFormComponentName =
  | "TextInput"
  | "TextAreaInput"
  | "DateTimeInput"
  | "ToggleInput"
  | "RadioInput"
  | "ImageSelectArrayInput"
  | "OverrideLinkInput"
  | "TagArrayInput"
  | "ItemArrayInput"
  | "ReferenceFeedInput";

export type CompoundFormComponentName = "DateRangeArrayInput";

export type SelectableOption = {
  label: string;
  value: string;
  default: boolean;
};

export type FormInputProps = {
  element?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
  valueOptions?: SelectableOption[];
  registerOpts?: RegisterOptions;
  rules?: UseFieldArrayProps["rules"];
};

export type FormSectionProps = {
  dataName: string;
  displayName: string;
  description?: string;
};
export type DecorativeFormComponentProps = {
  componentName: DecorativeFormComponentName;
  displayName: string;
};
export type AtomicFormComponentProps = {
  componentName: AtomicFormComponentName;
  input: FormInputProps;
} & FormSectionProps;

export type ChildInputProps = FormSectionProps & { input: FormInputProps };
export type CompoundFormComponentProps = {
  componentName: CompoundFormComponentName;
  inputGroup: {
    inputs: Record<string, ChildInputProps>;
    rules?: UseFieldArrayProps["rules"];
  };
} & FormSectionProps;

export type FormComponentProps =
  | AtomicFormComponentProps
  | CompoundFormComponentProps
  | DecorativeFormComponentProps;

const FormSubheading = ({ displayName }: { displayName: string }) => {
  return (
    <div className="flex gap-2 items-center pl-4">
      <Text textSize="md" className="sm:flex-none uppercase text-left ">
        {displayName}
      </Text>
      <hr className="border border-gray-400/50 flex-1 hidden sm:block" />
    </div>
  );
};

export const FallBackInput = () => <div className="skeleton h-24 w-full" />;

export const FormInput = (props: FormComponentProps & FromFormProps) => {
  return props.componentName === "Subheading" ? (
    <FormSubheading displayName={props.displayName} />
  ) : props.componentName === "TextInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.Text
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "TextAreaInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.TextArea
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "ToggleInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.Toggle
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "RadioInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.Radio
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "ImageSelectArrayInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.ImageSelectArray
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "TagArrayInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.TagArray
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "DateRangeArrayInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.DateRangeArray
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "ItemArrayInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.ItemArray
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "OverrideLinkInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.OverrideLink
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : props.componentName === "ReferenceFeedInput" ? (
    <Suspense fallback={<FallBackInput />}>
      <Inputs.ReferenceFeed
        {...props}
        errors={get(props.errors || {}, props.dataName)}
      />
    </Suspense>
  ) : (
    <p>Unsupported input type</p>
  );
};

export type FormErrorProps = {
  error: FieldError | undefined;
};

export const FormError = ({ error }: FormErrorProps) => {
  if (error?.root) {
    return (
      <div
        className={clsx(["px-4 py-2 mt-1", "bg-accent text-accent-content"])}
      >
        {error.root.message}
      </div>
    );
  }
  return (
    <>
      {error && (
        <div
          className={clsx(["px-4 py-2 mt-1", "bg-accent text-accent-content"])}
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
            "text-accent text-lg",
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
