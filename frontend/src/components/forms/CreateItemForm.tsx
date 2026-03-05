import {
  CONTENT_INPUT,
  IMAGE_IDS_INPUT,
  SUBTITLE_INPUT,
  TITLE_INPUT,
  // TAGNAMES_INPUT,
  // DATE_RANGES_INPUT,
  TITLE_DEFAULT,
  SUBTITLE_DEFAULT,
  CONTENT_DEFAULT,
  IMAGE_IDS_DEFAULT,
  // TAGNAMES_DEFAULT,
  // DATE_RANGES_DEFAULT,
} from "../../config/inputs";
import { withFormHandling } from "../../network/api";
import { CreateItemInput, useCreateItem } from "../../network/item";
import {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "./Form";

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
        TITLE_INPUT,
        SUBTITLE_INPUT,
        CONTENT_INPUT,
        IMAGE_IDS_INPUT,
        // TAGNAMES_INPUT,
        // DATE_RANGES_INPUT,
      ]}
      defaultValues={{
        ...TITLE_DEFAULT,
        ...SUBTITLE_DEFAULT,
        ...CONTENT_DEFAULT,
        ...IMAGE_IDS_DEFAULT,
        // ...TAGNAMES_DEFAULT,
        // ...DATE_RANGES_DEFAULT,
        ...defaultValues,
      }}
      trySubmit={async (args) =>
        withFormHandling(
          async () => {
            await createItem.mutateAsync(args as CreateItemInput);
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
