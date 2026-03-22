import { useState } from "react";
import { useController } from "react-hook-form";
import clsx from "clsx";
import { FormSubmitProps } from "./FormSubmit";
import Button from "../common/Button";
import Text from "../common/Text";
import toast from "react-hot-toast";

function FormScheduleSubmit({ control, triggerSubmit }: FormSubmitProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTimeValue = now.toISOString().slice(0, 16);

  const minExpiredAtValue = control._formValues.publishedAt
    ? new Date(control._formValues.publishedAt).toISOString().slice(0, 16)
    : minDateTimeValue;

  const { field: publishedAtField } = useController({
    control,
    name: "publishedAt",
  });
  const { field: expiredAtField } = useController({
    control,
    name: "expiredAt",
  });

  const handleDraft = () => {
    setShowSchedule(false);
    triggerSubmit();
  };

  const handlePublishNow = () => {
    publishedAtField.onChange(new Date().toISOString());
    expiredAtField.onChange(null);
    setShowSchedule(false);
    triggerSubmit();
  };

  const handleUnpublish = () => {
    publishedAtField.onChange(null);
    expiredAtField.onChange(null);
    setShowSchedule(false);
    triggerSubmit();
  };

  const handleSchedule = () => {
    if (showSchedule && publishedAtField.value) {
      triggerSubmit();
      setShowSchedule(false);
    } else if (showSchedule) {
      toast.error("Please set a publish date to schedule the item.");
    } else {
      setShowSchedule(true);
    }
  };

  const handleScheduleCancel = () => {
    setShowSchedule(false);
  };

  return (
    <fieldset className="flex flex-col gap-4">
      {showSchedule ? (
        <div className="flex flex-col md:flex-row gap-4">
          <label className={clsx("form-control gap-1 flex-1")}>
            <span className="label-text text-sm text-neutral-content/70">
              Publish At
            </span>
            <input
              type="datetime-local"
              className="input input-bordered text-sm"
              {...publishedAtField}
              value={publishedAtField.value ?? ""}
              min={minDateTimeValue}
            />
          </label>
          <label className={clsx("form-control gap-1 flex-1")}>
            <span className="label-text text-sm text-neutral-content/70">
              Expired At
            </span>
            <input
              type="datetime-local"
              className="input input-bordered text-sm"
              {...expiredAtField}
              value={expiredAtField.value ?? ""}
              min={minExpiredAtValue}
            />
          </label>
        </div>
      ) : (
        <div className="border rounded p-4 pl-6 border-base-content/20">
          <Text textSize="sm" className="text-neutral-content/70">
            <SchedulingMessage
              publishedAt={publishedAtField.value}
              expiredAt={expiredAtField.value}
            />
          </Text>
        </div>
      )}
      <div className="flex gap-2 justify-between w-full">
        {showSchedule && (
          <Button color={"error"} onClick={handleScheduleCancel}>
            Cancel
          </Button>
        )}
        <Button
          color={showSchedule ? "primary" : undefined}
          onClick={handleSchedule}
        >
          Schedule
        </Button>
        {!showSchedule && (
          <div className="flex gap-1">
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

export function SchedulingMessage({
  publishedAt,
  expiredAt,
}: {
  publishedAt?: string | null;
  expiredAt?: string | null;
}) {
  const now = new Date();
  const publishedAtDate = publishedAt ? new Date(publishedAt) : null;
  const expiredAtDate = expiredAt ? new Date(expiredAt) : null;
  if (expiredAtDate && expiredAtDate < now) {
    return <>Expired</>;
  } else if (
    publishedAtDate &&
    publishedAtDate > now &&
    expiredAtDate &&
    expiredAtDate > now
  ) {
    return (
      <>
        Scheduled from{" "}
        <span className="font-bold whitespace-nowrap">
          {publishedAtDate.toLocaleString()}
        </span>{" "}
        to{" "}
        <span className="font-bold whitespace-nowrap">
          {expiredAtDate.toLocaleString()}
        </span>
      </>
    );
  } else if (publishedAtDate && publishedAtDate > now) {
    return (
      <>
        Scheduled for{" "}
        <span className="font-bold whitespace-nowrap">
          {publishedAtDate.toLocaleString()}
        </span>
      </>
    );
  } else if (
    publishedAtDate &&
    publishedAtDate <= now &&
    expiredAtDate &&
    expiredAtDate > now
  ) {
    return (
      <>
        Published until{" "}
        <span className="font-bold whitespace-nowrap">
          {expiredAtDate.toLocaleString()}
        </span>
      </>
    );
  } else if (publishedAtDate && publishedAtDate <= now) {
    return <>Published</>;
  } else {
    return <>Unpublished</>;
  }
}

export default FormScheduleSubmit;
