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

export type SubmitArgs = Record<string, unknown>;

interface Field extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  componentName?: string;
  registerOptions?: RegisterOptions;
}

type FormProps = {
  fields: Field[];
  defaultValues: Record<string, unknown>;
  trySubmit: (args: SubmitArgs) => Promise<void>;
};

function Form({ fields, defaultValues, trySubmit }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (args: SubmitArgs) => {
    try {
      await trySubmit(args);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
      <input
        type="submit"
        value="Submit"
        className={clsx([
          "btn btn-primary btn-block",
          "uppercase tracking-widest text-sm font-semibold",
          { disabled: isSubmitting },
        ])}
      />
    </form>
  );
}

export type FormWithHeadingProps = {
  heading: string;
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
      <Heading
        headingSize={headingSize}
        headingStyles={headingStyles}
        headingDecorator={headingDecorator}
      >
        {heading}
      </Heading>
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
  return <TextInput register={register(name, registerOptions)} {...props} />;
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
