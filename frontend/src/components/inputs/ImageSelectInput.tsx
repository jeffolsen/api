import { useCallback, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useModalContext } from "../../contexts/ModalContext";
import { useGetImages } from "../../network/image";
import { FormInputProps } from "../forms/Form";
import EmptyModal, { EmptyModalProps } from "../modals/EmptyModal";
import Image from "../common/Image";
import Button from "../common/Button";
import clsx from "clsx";

type TypeFilter = "ICON" | "LANDSCAPE" | "PORTRAIT" | "";

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
    <span className="inline-flex border" onClick={onClick}>
      <Image
        src={image.url}
        alt={image.alt}
        {...{ width, height, fit: "contain" }}
      />
    </span>
  );
}

function AddImageButton() {
  return (
    <button
      className={clsx([
        "flex items-center justify-center",
        "w-[100px] h-[100px]",
        "border rounded border-base-content/20",
        "text-3xl text-primary-content/70",
      ])}
      type="button"
      onClick={() => console.log("Add image button clicked")}
    >
      +
    </button>
  );
}

function ImageSelectInput(
  props: Omit<FormInputProps, "watch" | "registerOptions">,
) {
  const { name, control, register, rules } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });
  const images = useGetImages();
  const selectedImages = useCallback(() => {
    const imageIds = (fields as ImageIdArrayFields).map(
      (field) => field.imageId,
    );
    return (
      images.data?.filter((image: Image) => imageIds.includes(image.id)) || []
    );
  }, [fields, images.data]);

  return (
    <label className="form-control flex flex-row flex-wrap gap-4 border rounded p-4 pl-6 border-base-content/20">
      <span className="label-text text-sm font-semibold text-neutral-content/70 w-full">
        Selected Images
      </span>
      {(fields as ImageIdArrayFields).map((field, index) => (
        <span key={field.id}>
          <SelectedImage
            image={selectedImages()[index]}
            onClick={() => remove(index)}
          />
          <input
            {...register(`${name}.${index}.imageId` as const)}
            {...props}
            type="hidden"
          />
        </span>
      ))}
      <AddImageButton />
      <ImageSelector
        images={images.data || []}
        selectedImages={selectedImages}
        onThumbnailClick={(imageId) => append({ imageId })}
        onPreviewClick={
          (index) => remove(index) // For simplicity, clicking a selected image in the preview will remove it. This can be changed to open a larger preview modal if desired.
        }
      />
    </label>
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
    return images
      .filter((image) => !selectedImages().includes(image))
      .filter((image) => {
        const matchesType = typeFilter ? image.type === typeFilter : true;
        const matchesSearch = image.alt
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      });
  }, [typeFilter, searchTerm, images, selectedImages]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
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
      <div className="flex flex-col gap-2 w-full">
        <input
          className="flex-grow input input-bordered"
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => {
            if (e.target.value.length) setTypeFilter("");
            setSearchTerm(e.target.value);
          }}
        />
        <div className="flex items-center gap-2">
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
              setTypeFilter((prev) =>
                prev === "LANDSCAPE" ? "" : "LANDSCAPE",
              );
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
        </div>
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
    <div className="flex flex-wrap gap-4 justify-center">
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

export { ImageSelectInput };
