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
import { TextInput } from "../inputs/TextInput";
import TextAreaInput from "../inputs/TextAreaInput";
import { ImageSelectInput } from "../inputs/ImageSelectInput";
import Button from "../common/Button";
import { ButtonColor } from "../common/helpers/contentStyles";

export type SubmitArgs = Record<string, unknown>;

export interface Field extends InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  name: string;
  componentName: string;
  registerOptions?: RegisterOptions;
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
      {fields.map(({ name, ...props }) => (
        <div key={name}>
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

export type FormInputProps = {
  name: string;
  componentName: string;
  control: Control;
  register: UseFormRegister<Record<string, unknown>>;
  watch: (field: string) => unknown;
  registerOptions?: RegisterOptions;
  rules?: UseFieldArrayProps["rules"];
};

const FormInput = ({ componentName, ...props }: FormInputProps) => {
  return componentName === "TextInput" ? (
    <TextInput {...props} />
  ) : componentName === "TextAreaInput" ? (
    <TextAreaInput {...props} />
  ) : componentName === "ImageSelectInput" ? (
    <ImageSelectInput {...props} />
  ) : componentName === "TagNamesInput" ? (
    <p>TAGNAMES</p>
  ) : componentName === "DateRangeSelectInput" ? (
    <p>DATERANGESELECTOR</p>
  ) : (
    <p>Unsupported input type</p>
  );
};

type FormErrorProps = {
  error: Merge<FieldError, FieldErrorsImpl<object>> | undefined;
};

const FormError = ({ error }: FormErrorProps) => {
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

export { FormWithHeading, FormError, FormInput };
export default Form;
