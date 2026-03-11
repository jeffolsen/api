import { FormInputProps } from "../forms/Form";
import {
  useFieldArray,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import Button, { XButton } from "../common/Button";

const descriptionDefaultOptions = {
  placeholder: "Description",
  registerOptions: {
    required: true,
  },
};

const startAtDefaultOptions = {
  placeholder: "Start At",
  registerOptions: {
    required: true,
    valueAsDate: true,
  },
};
const endAtDefaultOptions = {
  placeholder: "End At",
  registerOptions: {
    required: true,
    valueAsDate: true,
  },
};

function DateRangeSelectInput(props: Omit<FormInputProps, "componentName">) {
  const { name, control, rules, register, registerOptions } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });

  return (
    <fieldset className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20">
      <span className="label-text text-sm font-semibold text-neutral-content/70 w-full">
        Date Ranges
      </span>
      {fields.map((field, index) => (
        <DateRangeEntry
          key={field.id}
          index={index}
          remove={remove}
          register={register}
          registerOptions={registerOptions}
        />
      ))}
      <div>
        <Button
          color="primary"
          onClick={() => {
            append({});
          }}
        >
          +
        </Button>
      </div>
    </fieldset>
  );
}

function DateRangeEntry({
  index,
  remove,
  register,
}: {
  index: number;
  register: UseFormRegister<Record<string, unknown>>;
  registerOptions: RegisterOptions | undefined;
  remove: (index: number) => void;
}) {
  const { registerOptions: descRegisterOptions, ...descRestProps } =
    descriptionDefaultOptions;
  const { registerOptions: startAtRegisterOptions, ...startAtRestProps } =
    startAtDefaultOptions;
  const { registerOptions: endAtRegisterOptions, ...endAtRestProps } =
    endAtDefaultOptions;
  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-4 w-full text-neutral-content/70 text-sm">
        <div className="flex gap-4">
          <label className="form-control flex-1">
            StartAt
            <input
              className="input input-bordered"
              type="datetime-local"
              {...register(`dateRanges.${index}.startAt`, {
                ...startAtRegisterOptions,
              })}
              {...startAtRestProps}
            />
          </label>
          <label className="form-control flex-1">
            EndAt
            <input
              className="input input-bordered"
              type="datetime-local"
              {...register(`dateRanges.${index}.endAt`, {
                ...endAtRegisterOptions,
              })}
              {...endAtRestProps}
            />
          </label>
        </div>
        <input
          className="input input-bordered"
          type="text"
          {...register(`dateRanges.${index}.description`, {
            ...descRegisterOptions,
          })}
          {...descRestProps}
        />
      </div>
      <div className="flex flex-none self-end h-[48px]">
        <XButton
          className={"relative btn-sm"}
          onClick={() => {
            remove(index);
          }}
        >
          -
        </XButton>
      </div>
    </div>
  );
}

export default DateRangeSelectInput;
