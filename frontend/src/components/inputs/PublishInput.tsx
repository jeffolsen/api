import { useState } from "react";
import { useController } from "react-hook-form";
import clsx from "clsx";
import { FormSubmitProps } from "./FormSubmit";
import Button from "../common/Button";

type PublishMode = "draft" | "publish_now" | "schedule" | "unpublish";

function PublishInput({ control, triggerSubmit }: FormSubmitProps) {
  const [mode, setMode] = useState<PublishMode>("draft");

  const { field: publishedAtField } = useController({
    control,
    name: "publishedAt",
  });
  const { field: expiresAtField } = useController({
    control,
    name: "expiresAt",
  });

  const handleDraft = () => {
    setMode("draft");
    triggerSubmit();
  };

  const handlePublishNow = () => {
    publishedAtField.onChange(new Date().toISOString());
    expiresAtField.onChange(null);
    setMode("publish_now");
    triggerSubmit();
  };

  const handleUnpublish = () => {
    publishedAtField.onChange(null);
    expiresAtField.onChange(null);
    setMode("unpublish");
    triggerSubmit();
  };

  const handleSchedule = () => {
    setMode("schedule");
  };

  const handleScheduleCancel = () => {
    publishedAtField.onChange(null);
    expiresAtField.onChange(null);
    setMode("draft");
  };

  return (
    <fieldset className="flex flex-col gap-4">
      {mode === "schedule" && (
        <div className="flex flex-col gap-4">
          <label className={clsx("form-control gap-1")}>
            <span className="label-text text-sm text-neutral-content/70">
              Publish At
            </span>
            <input
              type="datetime-local"
              className="input input-bordered text-sm"
              {...publishedAtField}
              value={publishedAtField.value ?? ""}
            />
          </label>
          <label className={clsx("form-control gap-1")}>
            <span className="label-text text-sm text-neutral-content/70">
              Expires At
            </span>
            <input
              type="datetime-local"
              className="input input-bordered text-sm"
              {...expiresAtField}
              value={expiresAtField.value ?? ""}
            />
          </label>
        </div>
      )}
      <div className="flex gap-2 justify-between w-full">
        {mode === "schedule" && (
          <Button color={"error"} onClick={handleScheduleCancel}>
            Cancel
          </Button>
        )}
        <Button
          color={mode === "schedule" ? "primary" : undefined}
          onClick={handleSchedule}
        >
          Schedule
        </Button>
        {mode !== "schedule" && (
          <div className="flex gap-4">
            {!!publishedAtField.value && (
              <Button color={"primary"} onClick={handleUnpublish}>
                Unpublish
              </Button>
            )}
            <Button color={"primary"} onClick={handleDraft}>
              Save
            </Button>
            {!publishedAtField.value && (
              <Button color={"primary"} onClick={handlePublishNow}>
                Publish Now
              </Button>
            )}
          </div>
        )}
      </div>
    </fieldset>
  );
}

export default PublishInput;
