import { subheading, NAME_INPUT, NAME_DEFAULT } from "@/config/inputs";
import Form, {
  FormWithHeading,
  FormReponseHandlerProps,
  FormWithHeadingProps,
} from "@/components/forms/Form";
import { withFormHandling } from "@/network/api";
import {
  TComponent,
  TComponentInput,
  useCreateComponent,
  useModifyComponent,
  useUpdateComponent,
  useDeleteComponent,
} from "@/network/component";
import {
  TComponentType,
  useGetComponentTypeById,
} from "@/network/componentType";
import { TFeed, useGetFeedComponents } from "@/network/feed";
import {
  convertLocalDateTimeToZulu,
  convertZuluToLocalDateTime,
} from "@/utils/time";
import FormScheduleSubmit from "@/components/inputs/FormSubmitAndSchedule";
import Loading from "@/components/common/Loading";
import { useMemo } from "react";
import convertJSONSchemaToFormInputs, {
  propertyValuesFromFormMapper,
  propertyValuesToFormMapper,
} from "@/utils/jsonSchemaTransformer";
import Button, { IconButton } from "@/components/common/Button";
import { ChevronUp, ChevronDown, Trash } from "lucide-react";
import FormPublishSubmit from "@/components/inputs/FormSubmitAndPublish";

type FormValues = {
  typeId: TComponentType["id"];
  feedId: TFeed["id"];
  name: string;
  order: number;
  propertyValues: Record<string, unknown>;
  publishedAt?: string | null;
  expiredAt?: string | null;
};

const mapFormValuesToCreateComponentRequest = (
  values: FormValues,
): TComponentInput => ({
  typeId: values.typeId,
  feedId: values.feedId,
  name: values.name,
  order: values.order,
  propertyValues: propertyValuesFromFormMapper(values),
  publishedAt: values.publishedAt
    ? convertLocalDateTimeToZulu(values.publishedAt)
    : null,
  expiredAt: values.expiredAt
    ? convertLocalDateTimeToZulu(values.expiredAt)
    : null,
});

type MapFormValuesToUpdateComponentRequest = Partial<
  Omit<FormValues, "typeId" | "feedId">
>;

const mapFormValuesToPatchComponentRequest = (
  values: MapFormValuesToUpdateComponentRequest,
): Partial<TComponentInput> => ({
  ...(values.name && { name: values.name }),
  ...(values.order && { order: values.order }),
  ...(values.propertyValues && {
    propertyValues: propertyValuesFromFormMapper(values as FormValues),
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

const mapGetComponentToFormValues = (
  component: TComponent,
): FormValues & { id: TComponent["id"] } => ({
  id: component.id,
  typeId: component.typeId,
  feedId: component.feedId,
  name: component.name,
  order: component.order,
  propertyValues: propertyValuesToFormMapper(component.propertyValues),
  publishedAt: component.publishedAt
    ? convertZuluToLocalDateTime(component.publishedAt)
    : null,
  expiredAt: component.expiredAt
    ? convertZuluToLocalDateTime(component.expiredAt)
    : null,
});

function ComponentCreateForm({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: Partial<FormValues> & {
      typeId: TComponentType["id"];
      feedId: TFeed["id"];
      order: number;
    };
  }) {
  const { typeId } = defaultValues;
  const createComponent = useCreateComponent();
  const componentTypesQuery = useGetComponentTypeById(typeId);

  const { inputs: schemaInputs, defaults: schemaDefaults } = useMemo(
    () =>
      convertJSONSchemaToFormInputs(
        componentTypesQuery.data?.componentType.propertySchema || {},
      ),
    [componentTypesQuery.data],
  );

  if (componentTypesQuery.isLoading) {
    return <Loading />;
  }

  return (
    <FormWithHeading
      fields={[
        subheading(
          "New Component: " + componentTypesQuery.data?.componentType.name,
        ),
        NAME_INPUT,
        ...schemaInputs,
      ]}
      defaultValues={{
        ...NAME_DEFAULT,
        ...schemaDefaults,
        ...defaultValues,
      }}
      submitAction={async (args) =>
        withFormHandling(
          async () => {
            return createComponent.mutateAsync(
              mapFormValuesToCreateComponentRequest(args as FormValues),
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

function ComponentUpdateForm({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & { defaultValues: FormValues }) {
  const updateComponent = useUpdateComponent();
  const defaults = mapGetComponentToFormValues(defaultValues as TComponent);

  return (
    <ComponentCreateForm
      handleError={handleError}
      handleSuccess={handleSuccess}
      defaultValues={defaults}
      submitAction={async (args) => {
        const { id, ...data } = args;
        return withFormHandling(
          async () => {
            return updateComponent.mutateAsync({
              id: Number(id),
              data: mapFormValuesToCreateComponentRequest(data as FormValues),
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

function ComponentModifyOrderControls({
  component,
}: {
  component: TComponent;
}) {
  const { id, feedId, order } = component;
  const getFeedComponents = useGetFeedComponents(feedId);
  const feedLength = getFeedComponents.data?.components.length || 0;

  const modifyComponent = useModifyComponent();
  if (getFeedComponents.isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col gap-1">
      <IconButton
        color="primary"
        size="xs"
        disabled={order < 2}
        onClick={() =>
          modifyComponent.mutate({
            id,
            data: { feedId, order: order - 1 },
          })
        }
      >
        <ChevronUp />
      </IconButton>
      <div className="text-center text-xs">{order}</div>
      <IconButton
        color="primary"
        size="xs"
        disabled={order >= feedLength}
        onClick={() =>
          modifyComponent.mutate({
            id,
            data: { feedId, order: order + 1 },
          })
        }
      >
        <ChevronDown />
      </IconButton>
    </div>
  );
}

function ComponentRepublishForm({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: {
      id: number;
      feedId: number;
      publishedAt: string | null | undefined;
      expiredAt: string | null | undefined;
    };
  }) {
  const modifyComponent = useModifyComponent();

  return (
    <Form
      formStyles="inline-flex"
      defaultValues={defaultValues}
      SubmitInput={FormPublishSubmit}
      submitAction={async (args) => {
        const { id, ...data } = args;
        return withFormHandling(async () => {
          return modifyComponent.mutateAsync(
            {
              id: Number(id),
              data: {
                ...mapFormValuesToPatchComponentRequest(
                  data as MapFormValuesToUpdateComponentRequest,
                ),
                feedId: defaultValues.feedId,
              },
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

function ComponentDeleteButton({
  handleError,
  handleSuccess,
  defaultValues,
  ...props
}: FormWithHeadingProps &
  FormReponseHandlerProps & {
    defaultValues: {
      id: number;
      feedId: number;
    };
  }) {
  const deleteComponent = useDeleteComponent();

  return (
    <Button
      color="error"
      onClick={() =>
        confirm("Are you sure you want to delete this component?") &&
        withFormHandling(async () => {
          await deleteComponent.mutateAsync(
            {
              id: defaultValues.id,
              feedId: defaultValues.feedId as number,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            },
          );
        })
      }
      {...props}
    >
      <Trash size={16} />
    </Button>
  );
}

export {
  ComponentCreateForm,
  ComponentUpdateForm,
  ComponentModifyOrderControls,
  ComponentRepublishForm,
  ComponentDeleteButton,
};
