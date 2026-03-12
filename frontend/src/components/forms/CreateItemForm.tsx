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
} from "../../config/inputs";
import { withFormHandling } from "../../network/api";
import { CreateItemInput, useCreateItem } from "../../network/item";
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
  title?: string;
  subtitle?: string;
  content?: string;
  imageIds?: { imageId: number }[];
  tagNames?: { tagname: string }[];
  dateRanges?: DateRangeFormValues[];
};

const mapFormValuesToCreateItemInput = (
  values: FormValues,
): CreateItemInput => ({
  title: values.title,
  subtitle: values.subtitle,
  content: values.content,
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
        {
          componentName: "Subheading",
          displayName: "Item content",
        },
        NAME_INPUT,
        DESCRIPTION_INPUT,
        IMAGE_IDS_INPUT,
        {
          componentName: "Subheading",
          displayName: "Item meta",
        },
        TAGNAMES_INPUT,
        DATE_RANGES_INPUT,
      ]}
      defaultValues={{
        ...NAME_DEFAULT,
        ...DESCRIPTION_DEFAULT,
        ...IMAGE_IDS_DEFAULT,
        ...TAGNAMES_DEFAULT,
        ...DATE_RANGES_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await createItem.mutateAsync(
              mapFormValuesToCreateItemInput(args as FormValues),
            );
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          },
        )
      }
      {...props}
    />
  );
}

export { CreateItemForm };
