import { InputHTMLAttributes } from "react";
import { RegisterOptions, useForm } from "react-hook-form";
import clsx from "clsx";

type SubmitArgs = Record<string, unknown>;

interface Field extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
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
          <input
            className="input input-bordered w-full"
            {...register(name, registerOptions)}
            {...props}
          />
          {errors[name] && (
            <div className="bg-error px-4 py-2 mt-1 text-error-content">
              {errors[name].message}
            </div>
          )}
        </div>
      ))}
      <input
        type="submit"
        value="Submit"
        className={clsx(["btn", { disabled: isSubmitting }])}
      />
    </form>
  );
}

export default Form;
