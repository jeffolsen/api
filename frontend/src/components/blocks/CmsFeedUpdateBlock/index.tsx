import Block, { BlockComponentStandardProps } from "../Block";
import { FeedDeleteButton, FeedUpdateForm } from "../../forms/FeedCreateForm";
import { useNavigate } from "react-router";
import Loading from "../../common/Loading";
import { convertZuluToLocalDateTime } from "../../../utils/time";
import toast from "react-hot-toast";
import Heading from "../../common/Heading";
import Text from "../../common/Text";
import dayjs, { techDatetime } from "../../../utils/dayjs";
import SectionHeading from "../../partials/SectionHeading";
import Grid from "../../common/Grid";
import { ScheduleStatus } from "../../inputs/FormSubmitAndPublish";
import { TComponent } from "../../../network/component";
import {
  TComponentType,
  GetComponentTypesResponse,
} from "../../../network/componentType";
import { useMemo, useState } from "react";
import Button from "../../common/Button";
import {
  Plus,
  GalleryThumbnails,
  LayoutGrid,
  BookUser,
  ZodiacGemini,
  List,
  Spotlight,
  CornerDownLeft,
} from "lucide-react";
import Modal from "../../layout/Modal";
import clsx from "clsx";
import {
  ComponentCreateForm,
  ComponentRepublishForm,
  ComponentDeleteButton,
  ComponentModifyOrderControls,
  ComponentUpdateForm,
} from "../../forms/ComponentCreateForm";
import useFeedUpdateBlockData, {
  UseFeedUpdateBlockData,
  UseFeedUpdateBlockProps,
} from "./data";
import { paths } from "../../../config/routes";
import EmptyCard from "../../cards/EmptyCard";

type ComponentWithType = TComponent & { type?: TComponentType };

export default function Component(config: BlockComponentStandardProps) {
  const result = useFeedUpdateBlockData(config);
  if (result.type === "error") return null;
  const { blockProps, blockData } = result;
  return <CmsFeedUpdateBlock blockProps={blockProps} blockData={blockData} />;
}

function CmsFeedUpdateBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseFeedUpdateBlockProps;
  blockData: UseFeedUpdateBlockData;
}) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newComponent, setNewComponent] = useState<Pick<
    TComponent,
    "feedId" | "typeId" | "order"
  > | null>(null);

  const componentsWithTypes = useMemo(() => {
    const { feedComponentsData, componentTypesData } = blockData;
    if (
      feedComponentsData.error ||
      !feedComponentsData.data ||
      componentTypesData.error ||
      !componentTypesData.data
    ) {
      return [];
    }
    const components = feedComponentsData.data.components;
    const componentTypes = componentTypesData.data.componentTypes;
    return components
      .filter((component) => !!component.typeId)
      .map((component) => {
        const type = componentTypes.find(
          (t: TComponentType) => t.id === component.typeId,
        );
        return {
          ...component,
          type,
        };
      }) as ComponentWithType[];
  }, [blockData]);

  const settings = blockProps?.settings || {};
  const getFeed = blockData?.feedData;
  const getFeedComponents = blockData?.feedComponentsData;
  const getComponentTypes = blockData?.componentTypesData;

  if (
    getFeed.isLoading ||
    getFeedComponents.isLoading ||
    getComponentTypes.isLoading
  ) {
    return <Loading />;
  }
  const feed = getFeed.data?.feed;
  const feedComponents = getFeedComponents.data?.components || [];

  return (
    <Block {...blockProps} settings={settings}>
      <EmptyCard>
        <div className="card-body gap-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between w-full text-base/80">
            <div className="flex flex-col flex-grow justify-between gap-3">
              <Heading
                headingSize="xs"
                headingStyles="uppercase flex-none line-clamp-2"
              >
                {`${feed.path}${feed.subjectType === "SINGLE" ? "/:id" : ""}`}
              </Heading>
              <Text textSize="xs" className="italic flex-none">
                Last updated:{" "}
                {dayjs(convertZuluToLocalDateTime(feed.updatedAt)).format(
                  techDatetime,
                )}
              </Text>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <FeedDeleteButton
                defaultValues={{ id: feed.id }}
                handleSuccess={() => {
                  toast.success("Feed deleted successfully");
                  navigate(paths.cmsFeedsList);
                }}
              />
            </div>
          </div>
          <FeedUpdateForm defaultValues={feed} />
        </div>
      </EmptyCard>
      <SectionHeading text="Components" />
      <Grid
        items={[
          ...componentsWithTypes
            .sort((a, b) => a.order - b.order)
            .map((c) => {
              return {
                id: c.id,
                content: <ComponentCard key={c.id} component={c} />,
              };
            }),
          {
            id: "new",
            content: (
              <NewComponentCard key="new" onClick={() => setOpenModal(true)} />
            ),
          },
        ]}
      />
      <Modal
        closeConfirm="Are you sure you want to cancel creating this component?"
        onClose={() => {
          setNewComponent(null);
        }}
        isOpen={openModal}
        setIsOpen={setOpenModal}
      >
        {!newComponent ? (
          <ComponentTypeModal
            onSelect={({ id }) =>
              setNewComponent({
                feedId: feed.id,
                typeId: id,
                order: feedComponents.length + 1,
              })
            }
            componentTypes={
              (getComponentTypes.data as GetComponentTypesResponse)
                ?.componentTypes || []
            }
          />
        ) : (
          <CreateComponentModal
            feedId={feed.id}
            typeId={newComponent?.typeId}
            order={newComponent?.order}
            handleSuccess={() => {
              toast.success("Component created successfully");
              setOpenModal(false);
              setNewComponent(null);
            }}
          />
        )}
      </Modal>
    </Block>
  );
}

function ComponentCard({ component }: { component: ComponentWithType }) {
  const { id, publishedAt, expiredAt, type, feedId } = component;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <EmptyCard>
        <div className="card-body md:flex-row gap-4 justify-between w-full">
          <div className="flex md:flex-row-reverse gap-3">
            <div className="flex flex-col flex-grow justify-between gap-3">
              <Heading
                headingSize="xs"
                headingStyles="uppercase flex-none line-clamp-2"
              >
                {type?.name}
              </Heading>
              <Text textSize="xs" className="italic flex-none">
                Last updated:{" "}
                {dayjs(convertZuluToLocalDateTime(component.updatedAt)).format(
                  techDatetime,
                )}
              </Text>
            </div>
            <ComponentModifyOrderControls component={component} />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Text textSize="xs">
              <ScheduleStatus publishedAt={publishedAt} expiredAt={expiredAt} />
            </Text>
            <div className="flex gap-1">
              <Button
                onClick={() => setOpenModal(true)}
                size="md"
                color="primary"
              >
                Edit
              </Button>
              <ComponentRepublishForm
                formStyles="inline-flex"
                defaultValues={{ id, feedId, publishedAt, expiredAt }}
              />
              <ComponentDeleteButton
                defaultValues={{ id, feedId }}
                handleSuccess={() => {
                  toast.success("Component deleted successfully");
                }}
              />
            </div>
          </div>
        </div>
      </EmptyCard>
      <Modal
        closeConfirm="Are you sure you want to cancel updating this component?"
        isOpen={openModal}
        setIsOpen={setOpenModal}
      >
        <UpdateComponentModal
          component={component}
          handleSuccess={() => {
            toast.success("Component updated successfully");
            setOpenModal(false);
          }}
        />
      </Modal>
    </>
  );
}

function NewComponentCard({ onClick }: { onClick: () => void }) {
  return (
    <EmptyCard>
      <div className="card-body items-stretch justify-center">
        <Button
          as="button"
          onClick={onClick}
          color="primary"
          size="md"
          className="self-center"
        >
          <Plus size={16} /> New Component
        </Button>
      </div>
    </EmptyCard>
  );
}

function ComponentTypeModal({
  componentTypes,
  onSelect,
}: {
  componentTypes: TComponentType[];
  onSelect: (type: TComponentType) => void;
}) {
  const [singleSubjectTypes, collectionSubjectTypes] = useMemo(
    () => [
      componentTypes.filter(
        (ct) => ct.subjectType === "SINGLE",
      ) as TComponentType[],
      componentTypes.filter(
        (ct) => ct.subjectType === "COLLECTION",
      ) as TComponentType[],
    ],
    [componentTypes],
  );

  return (
    <div className="flex flex-col gap-8 pt-2">
      {singleSubjectTypes.length > 0 && (
        <div className="flex flex-col gap-3">
          <Heading
            headingSize="xs"
            headingDecorator="strike"
            headingStyles="mx-6 text-center"
          >
            Single Subject
          </Heading>
          <div className="flex gap-3">
            {singleSubjectTypes.map((ct: TComponentType) => (
              <ComponentTypeButton
                key={ct.id}
                componentType={ct}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
      {collectionSubjectTypes.length > 0 && (
        <div className="flex flex-col gap-2">
          <Heading
            headingSize="xs"
            headingDecorator="strike"
            headingStyles="mx-6 text-center"
          >
            Collection Subject
          </Heading>
          <div className="flex flex-wrap gap-2">
            {collectionSubjectTypes.map((ct: TComponentType) => (
              <ComponentTypeButton
                key={ct.id}
                componentType={ct}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentTypeButton({
  componentType,
  onSelect,
}: {
  componentType: TComponentType;
  onSelect: (type: TComponentType) => void;
}) {
  const componentTypeIcons: Record<string, React.ReactNode> = {
    HeroCarousel: <GalleryThumbnails size={48} />,
    TeaserGrid: <LayoutGrid size={48} />,
    RelatedContent: <ZodiacGemini size={48} />,
    Detail: <BookUser size={48} />,
    CuratedList: <List size={48} />,
    ContentHeader: <Spotlight size={48} />,
    Redirect: <CornerDownLeft size={48} />,
  };
  return (
    <button
      onClick={() => onSelect(componentType)}
      className={clsx([
        "btn btn-ghost border-gray-400/50 text-base/70 shadow-xl",
        "flex flex-col gap-2 items-center justify-center",
        "w-[150px] h-[150px]",
      ])}
    >
      <span>{componentTypeIcons[componentType.name]}</span>
      <span className="text-sm font-medium">{componentType.name}</span>
    </button>
  );
}

function CreateComponentModal({
  handleSuccess,
  feedId,
  typeId,
  order,
}: {
  handleSuccess: () => void;
  feedId: number;
  typeId: number;
  order: number;
}) {
  return (
    <ComponentCreateForm
      defaultValues={{ feedId, typeId, order }}
      handleSuccess={handleSuccess}
    />
  );
}

function UpdateComponentModal({
  handleSuccess,
  component,
}: {
  handleSuccess: () => void;
  component: ComponentWithType;
}) {
  const {
    id,
    feedId,
    typeId,
    order,
    publishedAt,
    expiredAt,
    propertyValues,
    name,
  } = component;
  const defaultValues = {
    id,
    feedId,
    typeId,
    order,
    name,
    propertyValues: propertyValues,
    publishedAt: publishedAt ? convertZuluToLocalDateTime(publishedAt) : null,
    expiredAt: expiredAt ? convertZuluToLocalDateTime(expiredAt) : null,
  };

  return (
    <ComponentUpdateForm
      defaultValues={defaultValues}
      handleSuccess={handleSuccess}
    />
  );
}
