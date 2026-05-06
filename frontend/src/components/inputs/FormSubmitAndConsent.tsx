import { Button } from "@/components/common/Button";
import { ButtonColor } from "@/components/common/helpers/contentStyles";
import { clsx } from "clsx";
import { FormError, FromFormProps } from "@/components/inputs/Input";
import { ChangeEventHandler, PropsWithChildren } from "react";
import CustomLink from "../common/Link";
import { useController } from "react-hook-form";

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

function FormSubmitAndAgreeToTerms({
  control,
  isSubmitting,
  triggerSubmit,
  submitInputConfig,
}: FormSubmitProps) {
  const submitButtonText = submitInputConfig?.text || "Submit";
  const submitButtonColor = submitInputConfig?.color || "primary";

  const {
    field: consentToPrivacy,
    fieldState: { error: privacyError },
  } = useController({
    control,
    name: "consentToPrivacy",
    rules: {
      required: "You must consent to the site's Privacy Policy proceed",
    },
  });

  const {
    field: consentToTerms,
    fieldState: { error: termsError },
  } = useController({
    control,
    name: "consentToTerms",
    rules: {
      required: "You must consent to the site's Terms of Service proceed",
    },
  });

  const {
    field: assertEighteenYearsOrOlder,
    fieldState: { error: ageError },
  } = useController({
    control,
    name: "assertEighteenYearsOrOlder",
    rules: {
      required: "You must be 18 yers or older to proceed",
    },
  });

  return (
    <>
      <fieldset className="flex flex-col gap-3">
        <LegalCheckBox
          isChecked={consentToPrivacy.value}
          onChange={(e) => {
            consentToPrivacy.onChange(e.target.checked);
          }}
        >
          I have read and consent to the site's{" "}
          <CustomLink to="/privacy" linkColor="primary">
            Privacy Policy
          </CustomLink>
        </LegalCheckBox>
        <FormError error={privacyError} />
        <LegalCheckBox
          isChecked={consentToTerms.value}
          onChange={(e) => {
            consentToTerms.onChange(e.target.checked);
          }}
        >
          I have read and consent to the site's{" "}
          <CustomLink to="/terms" linkColor="primary">
            Terms of Service
          </CustomLink>
        </LegalCheckBox>
        <FormError error={termsError} />
        <LegalCheckBox
          isChecked={assertEighteenYearsOrOlder.value}
          onChange={(e) => {
            assertEighteenYearsOrOlder.onChange(e.target.checked);
          }}
        >
          I assert that I am 18 years or older.
        </LegalCheckBox>
        <FormError error={ageError} />
      </fieldset>

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
    </>
  );
}

type CheckBox = {
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
  isChecked: boolean;
};

const LegalCheckBox = ({
  isChecked,
  onChange,
  children,
}: PropsWithChildren<CheckBox>) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={clsx(
          "checkbox bg-base-300",
          !isChecked ? "checkbox-neutral" : "checkbox-primary",
        )}
        checked={isChecked}
        onChange={onChange}
      />
      <span>{children}</span>
    </label>
  );
};

export default FormSubmitAndAgreeToTerms;
