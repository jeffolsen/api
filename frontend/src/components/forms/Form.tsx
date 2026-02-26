import { InputHTMLAttributes } from "react";
import {
  RegisterOptions,
  useForm,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
} from "react-hook-form";
import clsx from "clsx";
import Heading, { HeadingProps, HeadingLevelProvider } from "../common/Heading";
import { TextInput } from "../inputs/TextInput";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { Button } from "../common/Button";
import { ButtonColor } from "../common/helpers/contentStyles";

export type SubmitArgs = Record<string, unknown>;

export type FormWrapperProps = {
  handleError?: (error: Error) => void;
  handleSuccess?: () => void;
};

interface Field extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  componentName?: string;
  registerOptions?: RegisterOptions;
}

type FormProps = {
  fields: Field[];
  defaultValues: Record<string, unknown>;
  trySubmit: (args: SubmitArgs) => Promise<void>;
  submitButtonText?: string;
  submitButtonColor?: ButtonColor;
  formStyles?: string;
};

function Form({
  fields,
  defaultValues,
  trySubmit,
  submitButtonText,
  submitButtonColor = "primary",
  formStyles,
}: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    console.log("Resetting form with defaultValues:", defaultValues);
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
      {fields.map(({ name, registerOptions = {}, ...props }) => (
        <div key={name}>
          <FormInput
            name={name}
            register={register}
            registerOptions={registerOptions}
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

type FormInputProps = {
  name: string;
  register: UseFormRegister<Record<string, unknown>>;
  registerOptions: RegisterOptions;
};

const FormInput = ({
  name,
  register,
  registerOptions,
  ...props
}: FormInputProps) => {
  const required = !!registerOptions.required;
  return (
    <TextInput
      register={register(name, registerOptions)}
      required={required}
      {...props}
    />
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
