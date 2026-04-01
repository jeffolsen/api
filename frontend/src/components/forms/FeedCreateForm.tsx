// import { TComponentInput } from "../../network/component";
import {
  useCreateFeed,
  useUpdateFeed,
  useModifyFeed,
  useDeleteFeed,
  TFeedInput,
} from "../../network/feed";
import { convertLocalDateTimeToZulu } from "../../utils/time";
import FormScheduleSubmit from "../inputs/FormScheduleSubmit";
import { withFormHandling } from "../../network/api";
import Form, {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "./Form";
import {
  IS_SINGLE_SUBJECT_TYPE_DEFAULT,
  IS_SINGLE_SUBJECT_TYPE_INPUT,
  PATH_DEFAULT,
  PATH_INPUT,
} from "../../config/inputs";
import FormPublishSubmit from "../inputs/FormPublishSubmit";
import { Button } from "../common/Button";
import { Trash } from "lucide-react";

type FormValues = {
  path?: string;
  isSingleSubjectType?: boolean;
  publishedAt?: string | null;
  expiredAt?: string | null;
};

const mapFormValuesToCreateFeedRequest = (values: FormValues): TFeedInput => ({
  path: values.path || "",
  subjectType: values.isSingleSubjectType ? "SINGLE" : "COLLECTION",
  publishedAt: values.publishedAt
    ? convertLocalDateTimeToZulu(values.publishedAt)
    : null,
  expiredAt: values.expiredAt
    ? convertLocalDateTimeToZulu(values.expiredAt)
    : null,
});

function FeedCreateForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const createFeed = useCreateFeed();
  return (
    <FormWithHeading
      defaultValues={{
        ...IS_SINGLE_SUBJECT_TYPE_DEFAULT,
        ...PATH_DEFAULT,
        ...defaultValues,
      }}
      fields={[IS_SINGLE_SUBJECT_TYPE_INPUT, PATH_INPUT]}
      submitAction={async (args) => {
        withFormHandling(
          async () => {
            return createFeed.mutateAsync(
              mapFormValuesToCreateFeedRequest(args as FormValues),
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        );
      }}
      SubmitInput={FormScheduleSubmit}
      {...props}
    />
  );
}

function FeedUpdateForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const updateFeed = useUpdateFeed();
  return (
    <FormWithHeading
      defaultValues={{
        ...PATH_DEFAULT,
        ...defaultValues,
      }}
      fields={[PATH_INPUT]}
      submitAction={async (args) => {
        withFormHandling(
          async () => {
            const { id, ...data } = args;
            return updateFeed.mutateAsync({
              id: Number(id),
              data: mapFormValuesToCreateFeedRequest(data as FormValues),
            });
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        );
      }}
      SubmitInput={FormScheduleSubmit}
      {...props}
    />
  );
}

function FeedRepublishForm({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: {
      id: number;
      publishedAt: string | null | undefined;
      expiredAt: string | null | undefined;
    };
  }) {
  const modifyFeed = useModifyFeed();

  return (
    <Form
      formStyles="inline-flex"
      defaultValues={defaultValues}
      SubmitInput={FormPublishSubmit}
      submitAction={async (args) => {
        const { id, ...data } = args;
        return withFormHandling(async () => {
          return modifyFeed.mutateAsync(
            {
              id: Number(id),
              data: mapFormValuesToCreateFeedRequest(data as FormValues),
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            },
          );
        });
      }}
      {...props}
    />
  );
}

function FeedDeleteButton({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: {
      id: number;
    };
  }) {
  const deleteFeed = useDeleteFeed();

  return (
    <Button
      color="error"
      onClick={() =>
        confirm("Are you sure you want to delete this feed?") &&
        withFormHandling(async () => {
          await deleteFeed.mutateAsync(defaultValues.id, {
            onSuccess: handleSuccess,
            onError: handleError,
          });
        })
      }
      {...props}
    >
      <Trash size={16} />
    </Button>
  );
}

export { FeedCreateForm, FeedUpdateForm, FeedRepublishForm, FeedDeleteButton };
