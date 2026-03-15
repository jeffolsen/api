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
import { CreateItemInput, useCreateItem } from "../../network/item";
import PublishInput from "../inputs/PublishInput";
import {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "./Form";

type DateRangeFormValues = {
  startAt: string;
  endAt: string;
  description: string;
};

type FormValues = {
  name?: string;
  description?: string;
  imageIds?: { imageId: number }[];
  tagNames?: { tagname: string }[];
  dateRanges?: DateRangeFormValues[];
  publishedAt?: string | null;
  expiresAt?: string | null;
};

const mapFormValuesToCreateItemInput = (
  values: FormValues,
): CreateItemInput => ({
  name: values.name,
  description: values.description,
  publishedAt: values.publishedAt,
  expiresAt: values.expiresAt,
  imageIds:
    values.imageIds?.map((img: { imageId: number }) => img.imageId) || [],
  tagNames:
    values.tagNames?.map((tag: { tagname: string }) => tag.tagname) || [],
  dateRanges:
    values.dateRanges?.map((dateRange: DateRangeFormValues) => ({
      startAt: dateRange.startAt,
      endAt: dateRange.endAt,
      description: dateRange.description,
    })) || [],
});

function CreateItemForm({
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
              mapFormValuesToCreateItemInput(args as FormValues),
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      SubmitInput={PublishInput}
      {...props}
    />
  );
}

export { CreateItemForm };
