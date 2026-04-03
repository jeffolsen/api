import { useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import toast from "react-hot-toast";
import Heading, { HeadingProps, HeadingLevelProvider } from "../common/Heading";
import FormInput, { FormComponentProps } from "../inputs/Input";
import FormSubmit, { FormSubmitProps } from "../inputs/FormSubmit";
import { FC } from "react";

export type SubmitArgs = Record<string, unknown>;

export type FormReponseHandlerProps = {
  handleError?: (error: Error) => void;
  handleSuccess?: (args: SubmitArgs) => void;
};

export type FormProps = {
  fields?: FormComponentProps[];
  defaultValues?: Record<string, unknown>;
  submitAction?: (args: SubmitArgs) => Promise<void>;
  SubmitInput?: FC<FormSubmitProps>;
  submitInputConfig?: FormSubmitProps["submitInputConfig"];
  formStyles?: string;
};

function Form({
  fields = [],
  defaultValues = {},
  submitAction = async () => {},
  SubmitInput = FormSubmit,
  submitInputConfig = {},
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
    mode: "onBlur",
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (args: SubmitArgs) => {
    console.log("Submitting form with args:", args);
    try {
      await submitAction(args);
    } catch (error) {
      const errorData = JSON.parse((error as Error).message);
      errorData?.errors?.forEach((err: { message: string }) => {
        toast.error(err.message);
      });
    }
  };

  const triggerSubmit = handleSubmit(onSubmit);

  return (
    <form className={clsx(formStyles || "flex flex-col gap-4 w-full")}>
      {fields.map(({ ...props }, index) => (
        <div
          key={index}
          className={clsx([
            index !== 0 && props.componentName === "Subheading" && "mt-4",
          ])}
        >
          <FormInput
            register={register}
            watch={watch}
            control={control}
            errors={errors}
            {...props}
          />
        </div>
      ))}
      <SubmitInput
        isSubmitting={isSubmitting}
        triggerSubmit={triggerSubmit}
        register={register}
        watch={watch}
        control={control}
        errors={errors}
        submitInputConfig={submitInputConfig}
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
