import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

export const TextInput = ({
  required = false,
  register,
  ...props
}: {
  required?: boolean;
  register: UseFormRegisterReturn<string>;
}) => {
  return (
    <label
      className={clsx([
        "input input-bordered flex gap-2 items-center",
        "tracking-wider text-sm font-semibold",
      ])}
    >
      <span className="text-error w-2 text-left"> {required && <>*</>}</span>
      <input className="flex-grow" {...register} {...props} />
    </label>
  );
};
