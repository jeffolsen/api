import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

export const TextInput = ({
  register,
  ...props
}: {
  register: UseFormRegisterReturn<string>;
}) => {
  return (
    <input
      className={clsx([
        "input input-bordered w-full",
        "tracking-wider lowercase text-sm font-semibold",
      ])}
      {...register}
      {...props}
    />
  );
};
