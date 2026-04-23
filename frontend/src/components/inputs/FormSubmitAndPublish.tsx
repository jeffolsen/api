import { useController } from "react-hook-form";
import { FormSubmitProps } from "./FormSubmit";
import Button from "../common/Button";

function PublishInput({ control, triggerSubmit }: FormSubmitProps) {
  const { field: publishedAtField } = useController({
    control,
    name: "publishedAt",
  });
  const { field: expiredAtField } = useController({
    control,
    name: "expiredAt",
  });

  const handlePublishNow = () => {
    publishedAtField.onChange(new Date().toISOString());
    expiredAtField.onChange(null);
    triggerSubmit();
  };

  const handleUnpublish = () => {
    publishedAtField.onChange(null);
    expiredAtField.onChange(null);
    triggerSubmit();
  };

  return (
    <fieldset>
      {!publishedAtField.value ? (
        <Button color={"primary"} onClick={handlePublishNow}>
          Publish
        </Button>
      ) : (
        <Button color={"primary"} onClick={handleUnpublish}>
          Unpublish
        </Button>
      )}
    </fieldset>
  );
}

export function ScheduleStatus({
  publishedAt,
  expiredAt,
}: {
  publishedAt?: string | null;
  expiredAt?: string | null;
}) {
  const now = new Date();
  const publishedDate = publishedAt ? new Date(publishedAt) : null;
  const expiredDate = expiredAt ? new Date(expiredAt) : null;

  if (publishedDate && publishedDate > now) {
    return <span>Scheduled</span>;
  } else if (expiredDate && expiredDate < now) {
    return <span>Expired</span>;
  } else if (
    publishedDate &&
    publishedDate <= now &&
    (!expiredDate || expiredDate > now)
  ) {
    return <span>Published</span>;
  } else {
    return <span>Unpublished</span>;
  }
}

export default PublishInput;
