import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

export const TextInput = ({
  required = false,
  register,
  watchedValue,
  ...props
}: {
  required?: boolean;
  value?: string;
  register: UseFormRegisterReturn<string>;
  watchedValue?: unknown;
}) => {
  return (
    <label
      className={clsx([
        "input input-bordered flex gap-2 items-center",
        "tracking-wider text-sm font-semibold",
      ])}
    >
      <span className={clsx("text-error", "w-2 text-left")}>
        {required && !watchedValue && <>*</>}
      </span>
      <input className="flex-grow" {...register} {...props} />
    </label>
  );
};
