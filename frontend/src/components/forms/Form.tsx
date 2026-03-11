import { useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import toast from "react-hot-toast";
import Heading, { HeadingProps, HeadingLevelProvider } from "../common/Heading";
import Button from "../common/Button";
import { ButtonColor } from "../common/helpers/contentStyles";
import FormInput, { FormComponentProps } from "../inputs/Input";

export type SubmitArgs = Record<string, unknown>;

export type FormReponseHandlerProps = {
  handleError?: (error: Error) => void;
  handleSuccess?: () => void;
};

type FormProps = {
  fields?: FormComponentProps[];
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
      {fields.map(({ dataName, ...props }, index) => (
        <div
          key={index}
          className={clsx([
            index !== 0 && props.componentName === "Subheading" && "mt-4",
          ])}
        >
          <FormInput
            dataName={dataName}
            register={register}
            watch={watch}
            control={control}
            errors={errors}
            {...props}
          />
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

export { FormWithHeading };

export default Form;
