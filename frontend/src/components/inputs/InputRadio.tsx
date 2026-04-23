import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FormError,
  SelectableOption,
} from "./Input";
import FieldSetWrapperWithMinMax from "../partials/FieldSetWrapper";

export type RadioInputProps = Omit<
  AtomicFormComponentProps & ChildFromFormProps,
  "control" | "rules" | "componentName"
>;

export const RadioInput = (props: RadioInputProps) => {
  const { dataName, displayName, description, register, watch, errors, input } =
    props;
  const valueOptions = input?.valueOptions || [];
  const watchedValue = watch(dataName);

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
      >
        <div className="flex flex-wrap gap-4">
          {valueOptions?.map((option: SelectableOption) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                className="radio"
                {...register(dataName)}
                type="radio"
                value={option.value}
                checked={watchedValue === option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
    </>
  );
};

export default RadioInput;
