import { useCreateFeed } from "@/network/feed/useCreateFeed";
import { useUpdateFeed } from "@/network/feed/useUpdateFeed";
import { useModifyFeed } from "@/network/feed/useModifyFeed";
import { useDeleteFeed } from "@/network/feed/useDeleteFeed";
import { TFeedInput, TFeedTags, TFeedWithIncludes } from "@/network/feed/types";
import {
  convertLocalDateTimeToZulu,
  convertZuluToLocalDateTime,
} from "@/utils/time";
import FormScheduleSubmit from "@/components/inputs/FormSubmitAndSchedule";
import { withFormHandling } from "@/network/api";
import Form, {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "@/components/forms/Form";
import {
  IS_SINGLE_SUBJECT_TYPE_DEFAULT,
  IS_SINGLE_SUBJECT_TYPE_INPUT,
  PATH_DEFAULT,
  PATH_INPUT,
  TAGNAMES_DEFAULT,
  FEED_TAGNAMES_INPUT,
} from "@/config/inputs";
import FormPublishSubmit from "@/components/inputs/FormSubmitAndPublish";
import { Button } from "@/components/common/Button";
import { Trash } from "lucide-react";
import { TTagInput } from "@/network/tag/types";

type FormValues = {
  path?: string;
  isSingleSubjectType?: boolean;
  tagNames?: TTagInput[];
  publishedAt?: string | null;
  expiredAt?: string | null;
};

const mapFormValuesToCreateFeedRequest = (
  values: FormValues,
): TFeedInput & TFeedTags => ({
  path: values.path || "",
  subjectType: values.isSingleSubjectType ? "SINGLE" : "COLLECTION",
  tagNames: values.tagNames?.map((tag: TTagInput) => tag.name) || [],
  publishedAt: values.publishedAt
    ? convertLocalDateTimeToZulu(values.publishedAt)
    : null,
  expiredAt: values.expiredAt
    ? convertLocalDateTimeToZulu(values.expiredAt)
    : null,
});

const mapFormValuesToPatchFeedRequest = (
  values: FormValues,
): Partial<TFeedInput> => ({
  ...(values.path && { path: values.path }),
  ...(values.isSingleSubjectType !== undefined && {
    subjectType: values.isSingleSubjectType ? "SINGLE" : "COLLECTION",
  }),
  ...(values.publishedAt
    ? {
        publishedAt: convertLocalDateTimeToZulu(values.publishedAt),
      }
    : values.publishedAt === null
      ? { publishedAt: null }
      : {}),
  ...(values.expiredAt
    ? {
        expiredAt: convertLocalDateTimeToZulu(values.expiredAt),
      }
    : values.expiredAt === null
      ? { expiredAt: null }
      : {}),
});

const mapGetFeedToFormValues = (feed: TFeedWithIncludes) => {
  return {
    id: feed.id,
    path: feed.path,
    isSingleSubjectType: feed.subjectType === "SINGLE",
    tagNames: feed.tags?.map((t) => ({ name: t.tag.name })) || [],
    publishedAt: feed.publishedAt
      ? convertZuluToLocalDateTime(feed.publishedAt)
      : null,
    expiredAt: feed.expiredAt
      ? convertZuluToLocalDateTime(feed.expiredAt)
      : null,
  };
};

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
        ...TAGNAMES_DEFAULT,
        ...defaultValues,
      }}
      fields={[IS_SINGLE_SUBJECT_TYPE_INPUT, PATH_INPUT, FEED_TAGNAMES_INPUT]}
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
  const defaults = mapGetFeedToFormValues(defaultValues as TFeedWithIncludes);
  return (
    <FormWithHeading
      defaultValues={{
        ...PATH_DEFAULT,
        ...TAGNAMES_DEFAULT,
        ...defaults,
      }}
      fields={[PATH_INPUT, FEED_TAGNAMES_INPUT]}
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
          console.log("Republishing feed with data:", data);
          return modifyFeed.mutateAsync(
            {
              id: Number(id),
              data: mapFormValuesToPatchFeedRequest(data as FormValues),
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
      color="accent"
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
