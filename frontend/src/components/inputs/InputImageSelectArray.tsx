import { useCallback, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useGetImages } from "@/network/image";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
  FormError,
} from "@/components/inputs/Input";

import Modal from "@/components/layout/Modal";
import Image from "@/components/common/Image";
import Button, { PlusButton, XButton } from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import FieldSetWrapperWithMinMax from "@/components/partials/FieldSetWrapper";
import { clsx } from "clsx";

const typeFilters = ["ICON", "LANDSCAPE", "PORTRAIT", "OTHER", ""] as const;

type TypeFilter = (typeof typeFilters)[number];

type Image = {
  url: string;
  alt: string;
  id: number;
  type: TypeFilter;
};

type ImageIdField = {
  id: string;
  imageId: number;
};

type ImageIdArrayFields = Array<ImageIdField>;

type SelectImageProps = {
  image: Image;

  onClick: () => void;
  className?: string;
};

function SelectedImage({ image, onClick, className }: SelectImageProps) {
  return (
    <span
      className={clsx(
        "relative inline-flex items-center justify-center border border-gray-400/50 rounded cursor-pointer shadow-xl",
        "w-[75px] h-[75px] sm:w-[100px] sm:h-[100px]",
        className,
      )}
      onClick={onClick}
    >
      <Image
        src={image.url}
        alt={image.alt}
        {...{ fit: "contain" }}
        className="max-h-full"
      />
    </span>
  );
}

function ImageSelectInput(
  props: Omit<
    AtomicFormComponentProps & ChildFromFormProps,
    "watch" | "registerOptions" | "componentName"
  >,
) {
  const {
    displayName,
    dataName,
    description,
    control,
    register,
    errors,
    input,
  } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: dataName,
    rules: input?.rules,
  });
  const images = useGetImages();
  const [showImageSelector, setShowImageSelector] = useState(false);
  const elementProps = {
    ...(input?.element || {}),
    type: "hidden",
  };
  const registerProps = input?.registerOpts || {};
  const rulesProps = (input?.rules || {}) as FieldArrayMinMaxRule;

  const selectedImages = useCallback(() => {
    const imageIds = (fields as ImageIdArrayFields).map(
      (field) => field.imageId,
    );
    return (
      images.data?.images.filter((image: Image) =>
        imageIds.includes(image.id),
      ) || []
    );
  }, [fields, images.data]);

  const canSelectImages =
    (rulesProps?.minLength?.value || 0) + selectedImages().length <
    (rulesProps?.maxLength?.value || Infinity);

  if (images.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <FieldSetWrapperWithMinMax
        displayName={displayName}
        description={description}
        rules={rulesProps}
      >
        <span className="flex flex-wrap gap-4 w-full">
          {(fields as ImageIdArrayFields).map((field, index) => (
            <span key={field.id} className="relative">
              <SelectedImage
                image={selectedImages()[index]}
                onClick={() => remove(index)}
              />
              <XButton
                size="xs"
                className="absolute -top-2 -right-2"
                onClick={() => remove(index)}
              />
              <input
                {...register(
                  `${dataName}.${index}.imageId` as const,
                  registerProps,
                )}
                {...elementProps}
              />
            </span>
          ))}
          {canSelectImages && (
            <PlusButton
              className="text-3xl w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] bg-base-300"
              onClick={() => {
                setShowImageSelector(true);
              }}
            />
          )}
        </span>
      </FieldSetWrapperWithMinMax>
      <FormError error={errors} />
      <Modal isOpen={showImageSelector} setIsOpen={setShowImageSelector}>
        <ImageSelector
          images={images.data?.images || []}
          selectedImages={selectedImages}
          onThumbnailClick={(imageId) => append({ imageId })}
          onPreviewClick={(index) => remove(index)}
          rules={rulesProps}
          canSelectImages={canSelectImages}
        />
      </Modal>
    </>
  );
}

const ImageSelector = ({
  images = [],
  selectedImages = () => [],
  onThumbnailClick,
  onPreviewClick,
  canSelectImages,
  rules,
}: {
  images: Image[];
  selectedImages: () => Image[];
  onThumbnailClick: (imageId: number) => void;
  onPreviewClick?: (index: number) => void;
  canSelectImages: boolean;
  rules: FieldArrayMinMaxRule;
}) => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredImages = useCallback(() => {
    return (
      ((typeFilter || searchTerm) &&
        images
          .filter((image) => !selectedImages().includes(image))
          .filter((image) => {
            const matchesType = typeFilter ? image.type === typeFilter : true;
            const matchesSearch = image.alt
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
          })) ||
      []
    );
  }, [typeFilter, searchTerm, images, selectedImages]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full">
        <FieldArrayMinAndMax
          minLength={rules?.minLength?.value}
          maxLength={rules?.maxLength?.value}
        />
      </div>
      <div className="flex items-center gap-4 flex-wrap w-full">
        {selectedImages().map((image, index) => (
          <span
            key={image.id}
            className="relative inline-flex items-center gap-2"
          >
            <SelectedImage
              image={image}
              onClick={() => onPreviewClick?.(index)}
            />
            <XButton
              size="xs"
              className="absolute -top-2 -right-2"
              onClick={() => onPreviewClick?.(index)}
            />
          </span>
        ))}
      </div>

      {canSelectImages && (
        <>
          <input
            className="flex-grow input input-bordered border-gray-400/50 w-full bg-base-300"
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => {
              if (e.target.value.length) setTypeFilter("");
              setSearchTerm(e.target.value);
            }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-2 w-full">
            {typeFilters.filter(Boolean).map((type) => (
              <FilterButton
                key={type}
                active={typeFilter === type}
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter((prev) => (prev === type ? "" : type));
                }}
              >
                {type.toLowerCase()}
              </FilterButton>
            ))}
          </div>

          <ImageDrawer
            images={filteredImages()}
            onThumbnailClick={(imageId) => {
              onThumbnailClick(imageId);
            }}
          />
        </>
      )}
    </div>
  );
};

function FilterButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      color={active ? "primary" : "secondary"}
      size="sm"
      className="flex-1"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ImageDrawer({
  images,
  onThumbnailClick,
}: {
  images: Image[];
  onThumbnailClick: (imageId: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {images.map((image) => (
        <span key={image.id}>
          <SelectedImage
            image={image}
            onClick={() => onThumbnailClick(image.id)}
          />
        </span>
      ))}
    </div>
  );
}

export default ImageSelectInput;
