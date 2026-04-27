import {
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
  RequiredLabel,
} from "@/components/inputs/Input";
import Tooltip from "@/components/common/Tooltip";
import { PropsWithChildren } from "react";

type FieldSetWrapperWithMinMaxProps = {
  displayName: string;
  description?: string;
  rules?: FieldArrayMinMaxRule;
  watchedValue?: unknown;
  required?: boolean;
};

function FieldSetWrapperWithMinMax({
  displayName,
  description,
  watchedValue,
  required,
  rules,
  children,
}: PropsWithChildren<FieldSetWrapperWithMinMaxProps>) {
  return (
    <fieldset className="w-full form-control flex flex-row flex-wrap gap-4 border border-gray-400/50 rounded p-4 pl-6 shadow-xl">
      <legend className="label-text text-sm font-semibold w-full float-start flex items-center gap-3 !text-current">
        {required && watchedValue! === undefined && (
          <RequiredLabel
            watchedValue={watchedValue}
            required={required}
            position="absolute"
          />
        )}
        {displayName}{" "}
        {rules?.maxLength || rules?.minLength ? (
          <FieldArrayMinAndMax
            minLength={rules?.minLength?.value}
            maxLength={rules?.maxLength?.value}
          />
        ) : null}
        {description && <Tooltip text={description} />}
      </legend>
      {children}
    </fieldset>
  );
}

export default FieldSetWrapperWithMinMax;
