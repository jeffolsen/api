import { useCallback, useState, MouseEvent } from "react";
import { useFieldArray } from "react-hook-form";
import { useGetImages } from "../../network/image";
import {
  FormInputProps,
  FieldArrayMinAndMax,
  FieldArrayMinMaxRule,
} from "../forms/Form";
import Modal from "../layout/Modal";
import Image from "../common/Image";
import Button from "../common/Button";
import clsx from "clsx";

type TypeFilter = "ICON" | "LANDSCAPE" | "PORTRAIT" | "OTHER" | "";

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

function SelectedImage({
  image,
  height = 100,
  width = 100,
  onClick,
}: {
  image: Image;
  height?: number;
  width?: number;
  onClick: () => void;
}) {
  return (
    <span
      className="inline-flex border max-w-[75px] max-h-[75px] sm:max-w-[100px] sm:max-h-[100px] rounded border-base-content/20 cursor-pointer"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <Image
        src={image.url}
        alt={image.alt}
        {...{ width, height, fit: "contain" }}
      />
    </span>
  );
}

function AddImageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={clsx([
        "flex items-center justify-center",
        "w-[75px] h-[75px] sm:w-[100px] sm:h-[100px]",
        "border rounded border-base-content/20",
        "text-3xl text-primary-content/70",
      ])}
      type="button"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      +
    </button>
  );
}

function ImageSelectInput(
  props: Omit<FormInputProps, "watch" | "registerOptions" | "componentName">,
) {
  const { name, control, register, rules, ...restProps } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });
  const images = useGetImages();
  const [showImageSelector, setShowImageSelector] = useState(false);

  const selectedImages = useCallback(() => {
    const imageIds = (fields as ImageIdArrayFields).map(
      (field) => field.imageId,
    );
    return (
      images.data?.filter((image: Image) => imageIds.includes(image.id)) || []
    );
  }, [fields, images.data]);

  return (
    <>
      <label
        className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="label-text text-sm font-semibold text-neutral-content/70 w-full">
          Images{" "}
          <FieldArrayMinAndMax
            minLength={(rules as FieldArrayMinMaxRule)?.minLength?.value}
            maxLength={(rules as FieldArrayMinMaxRule)?.maxLength?.value}
          />
        </span>
        <span className="flex flex-wrap gap-2 w-full">
          {(fields as ImageIdArrayFields).map((field, index) => (
            <span key={field.id}>
              <SelectedImage
                image={selectedImages()[index]}
                onClick={() => remove(index)}
              />
              <input
                {...register(`${name}.${index}.imageId` as const)}
                {...restProps}
                type="hidden"
              />
            </span>
          ))}
          <AddImageButton
            onClick={() => {
              setShowImageSelector(true);
            }}
          />
        </span>
      </label>
      <Modal isOpen={showImageSelector} setIsOpen={setShowImageSelector}>
        <ImageSelector
          images={images.data || []}
          selectedImages={selectedImages}
          onThumbnailClick={(imageId) => append({ imageId })}
          onPreviewClick={(index) => remove(index)}
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
}: {
  images: Image[];
  selectedImages: () => Image[];
  onThumbnailClick: (imageId: number) => void;
  onPreviewClick?: (index: number) => void;
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
      <div className="flex items-center gap-4 flex-wrap w-full">
        {selectedImages().map((image, index) => (
          <span key={image.id} className="inline-flex items-center gap-2">
            <SelectedImage
              image={image}
              height={75}
              width={75}
              onClick={() => onPreviewClick?.(index)}
            />
          </span>
        ))}
      </div>
      <input
        className="flex-grow input input-bordered w-full"
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={(e) => {
          if (e.target.value.length) setTypeFilter("");
          setSearchTerm(e.target.value);
        }}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-2 w-full">
        <FilterButton
          active={typeFilter === "ICON"}
          onClick={() => {
            setSearchTerm("");
            setTypeFilter((prev) => (prev === "ICON" ? "" : "ICON"));
          }}
        >
          Icons
        </FilterButton>
        <FilterButton
          active={typeFilter === "LANDSCAPE"}
          onClick={() => {
            setSearchTerm("");
            setTypeFilter((prev) => (prev === "LANDSCAPE" ? "" : "LANDSCAPE"));
          }}
        >
          Landscapes
        </FilterButton>
        <FilterButton
          active={typeFilter === "PORTRAIT"}
          onClick={() => {
            setSearchTerm("");
            setTypeFilter((prev) => (prev === "PORTRAIT" ? "" : "PORTRAIT"));
          }}
        >
          Portraits
        </FilterButton>
        <FilterButton
          active={typeFilter === "OTHER"}
          onClick={() => {
            setSearchTerm("");
            setTypeFilter((prev) => (prev === "OTHER" ? "" : "OTHER"));
          }}
        >
          Other
        </FilterButton>
      </div>

      <ImageDrawer
        images={filteredImages()}
        onThumbnailClick={(imageId) => {
          onThumbnailClick(imageId);
        }}
      />
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
            height={50}
            width={50}
            onClick={() => onThumbnailClick(image.id)}
          />
        </span>
      ))}
    </div>
  );
}

export default ImageSelectInput;
