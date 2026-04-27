import { Button } from "@/components/common/Button";
import { ButtonColor } from "@/components/common/helpers/contentStyles";
import { clsx } from "clsx";
import { FromFormProps } from "@/components/inputs/Input";

export type FormSubmitProps = {
  isSubmitting: boolean;
  triggerSubmit: () => void;
  /**
   * @remarks submitInputConfig can include any additional configuration for the submit input component, such as button text or color. The specific properties will depend on the implementation of the SubmitInput component being used.
   */
  submitInputConfig?: Record<string, unknown> & {
    text?: string;
    color?: ButtonColor;
  };
} & Omit<FromFormProps, "componentName">;

function FormSubmit({
  isSubmitting,
  triggerSubmit,
  submitInputConfig,
}: FormSubmitProps) {
  const submitButtonText = submitInputConfig?.text || "Submit";
  const submitButtonColor = submitInputConfig?.color || "primary";
  return (
    <Button
      as="submit"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerSubmit();
      }}
      color={isSubmitting ? "disabled" : submitButtonColor}
      disabled={isSubmitting}
      value={isSubmitting ? "Submitting..." : submitButtonText}
      className={clsx(["sm:self-end"])}
    />
  );
}

export default FormSubmit;
