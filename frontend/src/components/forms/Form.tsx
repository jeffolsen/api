import { InputHTMLAttributes, useEffect } from "react";
import {
  RegisterOptions,
  useForm,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
  Control,
  UseFieldArrayProps,
} from "react-hook-form";
import clsx from "clsx";
import toast from "react-hot-toast";
import Heading, { HeadingProps, HeadingLevelProvider } from "../common/Heading";
import Text from "../common/Text";
import TextInput from "../inputs/TextInput";
import TextAreaInput from "../inputs/TextAreaInput";
import ImageSelectInput from "../inputs/ImageSelectInput";
import DateRangeSelectInput from "../inputs/DateRangeSelectInput";
import Button from "../common/Button";
import { ButtonColor } from "../common/helpers/contentStyles";
import TagArrayInput from "../inputs/TagArrayInput";

export type SubmitArgs = Record<string, unknown>;

export type FormComponentName =
  | "TextInput"
  | "TextAreaInput"
  | "ImageSelectInput"
  | "TagArrayInput"
  | "DateRangeSelectInput"
  | "Subheading";

export interface Field extends InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  name: string;
  componentName: FormComponentName;
  registerOptions?: RegisterOptions;
  rules?: UseFieldArrayProps["rules"];
  text?: string;
}

export type FormReponseHandlerProps = {
  handleError?: (error: Error) => void;
  handleSuccess?: () => void;
};

type FormProps = {
  fields?: Field[];
  defaultValues?: Record<string, unknown>;
  trySubmit?: (args: SubmitArgs) => Promise<void>;
  submitButtonText?: string;
  submitButtonColor?: ButtonColor;
  formStyles?: string;
};

function Form({
  fields = [],
  defaultValues = {},
  trySubmit = async () => {},
  submitButtonText,
  submitButtonColor = "primary",
  formStyles,
}: FormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  const onSubmit = async (args: SubmitArgs) => {
    try {
      await trySubmit(args);
    } catch (error) {
      const errorData = JSON.parse((error as Error).message);
      errorData?.errors?.forEach((err: { message: string }) => {
        toast.error(err.message);
      });
    }
  };

  return (
    <form
      className={clsx(formStyles || "flex flex-col gap-4 w-full")}
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map(({ name, ...props }, index) => (
        <div
          key={index}
          className={clsx([
            index !== 0 && props.componentName === "Subheading" && "mt-4",
          ])}
        >
          <FormInput
            name={name}
            register={register}
            watch={watch}
            control={control}
            {...props}
          />
          <FormError error={errors[name]} />
        </div>
      ))}
      <Button
        as="submit"
        color={submitButtonColor}
        disabled={isSubmitting}
        value={submitButtonText || "Submit"}
        className={clsx(["sm:self-end", { disabled: isSubmitting }])}
      />
    </form>
  );
}

export type FormWithHeadingProps = {
  heading?: string;
} & FormProps &
  HeadingProps;

const FormWithHeading = ({
  heading,
  headingSize,
  headingStyles,
  headingDecorator,
  ...props
}: FormWithHeadingProps) => {
  return (
    <HeadingLevelProvider>
      {heading && (
        <Heading
          headingSize={headingSize}
          headingStyles={headingStyles}
          headingDecorator={headingDecorator}
        >
          {heading}
        </Heading>
      )}
      <Form {...props} />
    </HeadingLevelProvider>
  );
};

const FormSubheading = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2 items-center pl-4">
      <Text
        textSize="md"
        className="sm:flex-none uppercase text-left text-neutral-content/70"
      >
        {text}
      </Text>
      <hr className="border-neutral-content/20 flex-1 hidden sm:block" />
    </div>
  );
};

export type FormInputProps = {
  name: string;
  componentName: string;
  control: Control;
  register: UseFormRegister<Record<string, unknown>>;
  watch: (field: string) => unknown;
  registerOptions?: RegisterOptions;
  rules?: UseFieldArrayProps["rules"];
  text?: string;
};

const FormInput = ({
  componentName,
  text = "Add a text field",
  ...props
}: FormInputProps) => {
  return componentName === "Subheading" ? (
    <FormSubheading text={text} />
  ) : componentName === "TextInput" ? (
    <TextInput {...props} />
  ) : componentName === "TextAreaInput" ? (
    <TextAreaInput {...props} />
  ) : componentName === "ImageSelectInput" ? (
    <ImageSelectInput {...props} />
  ) : componentName === "TagArrayInput" ? (
    <TagArrayInput {...props} />
  ) : componentName === "DateRangeSelectInput" ? (
    <DateRangeSelectInput {...props} />
  ) : (
    <p>Unsupported input type</p>
  );
};

type FormErrorProps = {
  error: Merge<FieldError, FieldErrorsImpl<object>> | undefined;
};

const FormError = ({ error }: FormErrorProps) => {
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

export { FormWithHeading, FormError, FormInput };
export default Form;
