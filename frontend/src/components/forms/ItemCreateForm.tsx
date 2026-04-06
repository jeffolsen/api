import {
  IMAGE_IDS_INPUT,
  DESCRIPTION_INPUT,
  NAME_INPUT,
  TAGNAMES_INPUT,
  DATE_RANGES_INPUT,
  NAME_DEFAULT,
  DESCRIPTION_DEFAULT,
  IMAGE_IDS_DEFAULT,
  TAGNAMES_DEFAULT,
  DATE_RANGES_DEFAULT,
  PUBLISH_DEFAULT,
  subheading,
} from "../../config/inputs";
import { withFormHandling } from "../../network/api";
import { TDateRangeInput } from "../../network/dateRange";
import { TTagInput } from "../../network/tag";
import { TImage } from "../../network/image";
import {
  useCreateItem,
  useModifyItem,
  useUpdateItem,
  useDeleteItem,
  TItemRelations,
  TItemInput,
  TItem,
} from "../../network/item";
import FormScheduleSubmit from "../inputs/FormScheduleSubmit";
import Form, {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "./Form";
import {
  convertLocalDateTimeToZulu,
  convertZuluToLocalDateTime,
} from "../../utils/time";
import FormPublishSubmit from "../inputs/FormPublishSubmit";
import { Button } from "../common/Button";
import { Trash } from "lucide-react";

export type FormValues = {
  name: string;
  description?: string;
  imageIds?: { imageId: TImage["id"] }[];
  tagNames?: TTagInput[];
  dateRanges?: TDateRangeInput[];
  publishedAt?: string | null;
  expiredAt?: string | null;
};

export type ItemFormValues = FormValues;

const mapFormValuesToCreateItemRequest = (
  values: FormValues,
): TItemInput & TItemRelations => ({
  name: values.name,
  description: values.description,
  publishedAt: values.publishedAt
    ? convertLocalDateTimeToZulu(values.publishedAt)
    : null,
  expiredAt: values.expiredAt
    ? convertLocalDateTimeToZulu(values.expiredAt)
    : null,
  imageIds:
    values.imageIds?.map((img: { imageId: TImage["id"] }) => img.imageId) || [],
  tagNames: values.tagNames?.map((tag: TTagInput) => tag.name) || [],
  dateRanges:
    values.dateRanges?.map((dateRange: TDateRangeInput) => ({
      startAt: convertLocalDateTimeToZulu(dateRange.startAt),
      endAt: convertLocalDateTimeToZulu(dateRange.endAt),
      description: dateRange.description,
    })) || [],
});

const mapGetItemToFormValues = (
  item: TItem & {
    tags?: TTagInput[];
    images?: TImage[];
    dateRanges?: TDateRangeInput[];
  },
): FormValues & { id: number } => ({
  id: item.id,
  name: item.name,
  description: item.description,
  publishedAt: item.publishedAt
    ? convertZuluToLocalDateTime(item.publishedAt)
    : null,
  expiredAt: item.expiredAt ? convertZuluToLocalDateTime(item.expiredAt) : null,
  imageIds: item.images?.map(({ id }) => ({ imageId: id })) || [],
  tagNames: item.tags?.map(({ name }) => ({ name })) || [],
  dateRanges:
    item.dateRanges?.map((dateRange) => ({
      startAt: convertZuluToLocalDateTime(dateRange.startAt),
      endAt: convertZuluToLocalDateTime(dateRange.endAt),
      description: dateRange.description,
    })) || [],
});

function ItemCreateForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const createItem = useCreateItem();

  return (
    <FormWithHeading
      fields={[
        subheading("Item content"),
        NAME_INPUT,
        DESCRIPTION_INPUT,
        IMAGE_IDS_INPUT,
        subheading("Item meta"),
        TAGNAMES_INPUT,
        DATE_RANGES_INPUT,
      ]}
      defaultValues={{
        ...NAME_DEFAULT,
        ...DESCRIPTION_DEFAULT,
        ...IMAGE_IDS_DEFAULT,
        ...TAGNAMES_DEFAULT,
        ...DATE_RANGES_DEFAULT,
        ...PUBLISH_DEFAULT,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            return createItem.mutateAsync(
              mapFormValuesToCreateItemRequest(args as FormValues),
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      SubmitInput={FormScheduleSubmit}
      {...props}
    />
  );
}

function ItemUpdateForm({
  handleError,
  handleSuccess,
  defaultValues = {},
  ...props
}: FormWithHeadingProps & FormReponseHandlerProps) {
  const updateItem = useUpdateItem();

  const defaults = mapGetItemToFormValues(
    defaultValues as TItem & {
      tags?: TTagInput[];
      images?: TImage[];
      dateRanges?: TDateRangeInput[];
    },
  );

  return (
    <ItemCreateForm
      handleError={handleError}
      handleSuccess={handleSuccess}
      defaultValues={defaults}
      submitAction={async (args) => {
        const { id, ...data } = args;
        return withFormHandling(
          async () => {
            return updateItem.mutateAsync({
              id: Number(id),
              data: mapFormValuesToCreateItemRequest(data as FormValues),
            });
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        );
      }}
      {...props}
    />
  );
}

function ItemRepublishForm({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: {
      id: number;
      publishedAt?: string | null;
      expiredAt?: string | null;
    };
  }) {
  const modifyItem = useModifyItem();

  return (
    <Form
      formStyles="inline-flex"
      defaultValues={defaultValues}
      SubmitInput={FormPublishSubmit}
      submitAction={async (args) => {
        const { id, ...data } = args;
        return withFormHandling(async () => {
          return modifyItem.mutateAsync(
            {
              id: Number(id),
              data: data,
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

function ItemDeleteButton({
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
  const deleteItem = useDeleteItem();

  return (
    <Button
      color="error"
      onClick={() =>
        confirm("Are you sure you want to delete this item?") &&
        withFormHandling(async () => {
          await deleteItem.mutateAsync(defaultValues.id, {
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

export { ItemCreateForm, ItemUpdateForm, ItemRepublishForm, ItemDeleteButton };
