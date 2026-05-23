import { UseQueryResult } from "@tanstack/react-query";
import {
  GetItemsWithIncludesResponse,
  TItem,
  TItemWithIncludes,
} from "@/network/item/types";
import { TImageType } from "@/network/image/types";
import { TTagName } from "@/network/tag/types";

const NOW = new Date().toISOString();
const START = "2023-01-01T00:00:00.000Z";
const END = "2024-01-01T00:00:00.000Z";

const mockImage = (
  id: number,
  type: TImageType,
  label: string,
): TItemWithIncludes["images"][number] => ({
  itemId: id,
  imageId: id,
  image: {
    id,
    url: `https://placehold.co/600x400?text=${encodeURIComponent(label)}`,
    alt: label,
    type,
    createdAt: NOW,
    updatedAt: NOW,
  },
});

const mockTag = (
  itemId: number,
  tagId: number,
  name: TTagName,
): TItemWithIncludes["tags"][number] => ({
  itemId,
  tagId,
  tag: { id: tagId, name },
});

const mockDateRange = (id: number): TItemWithIncludes["dateRanges"][number] => ({
  id,
  description: "Mock date range",
  startAt: START,
  endAt: END,
  createdAt: NOW,
  updatedAt: NOW,
});

const mockBase = (id: number, name: string): TItem => ({
  id,
  name,
  slug: `mock-item-${id}`,
  sortName: name.toLowerCase(),
  createdAt: NOW,
  updatedAt: NOW,
  publishedAt: NOW,
  expiredAt: null,
});

export const mockItems: TItemWithIncludes[] = [
  {
    ...mockBase(1, "Landscape Image With Description"),
    description:
      "A short description for this item, useful for teaser cards and related content blocks.",
    images: [mockImage(1, "LANDSCAPE", "Landscape")],
    tags: [mockTag(1, 1, "ART"), mockTag(1, 2, "DEVELOPMENT")],
    dateRanges: [mockDateRange(1)],
  },
  {
    ...mockBase(2, "Portrait Image No Description"),
    images: [mockImage(2, "PORTRAIT", "Portrait")],
    tags: [mockTag(2, 3, "REACT"), mockTag(2, 4, "TYPESCRIPT")],
    dateRanges: [],
  },
  {
    ...mockBase(3, "Icon With Long Name For Truncation Testing Overflow"),
    description:
      "Icon type images use contain fit and padding. This description is longer than the previous ones to test multi-line truncation behavior in cards.",
    images: [mockImage(3, "ICON", "Icon")],
    tags: [mockTag(3, 5, "NODE")],
    dateRanges: [mockDateRange(3)],
  },
  {
    ...mockBase(4, "No Image With Tags"),
    description:
      "This item has no image, so blocks should render their fallback state — usually the item name displayed as text inside the figure area.",
    images: [],
    tags: [mockTag(4, 6, "UX"), mockTag(4, 7, "COLLABORATION"), mockTag(4, 8, "SCRUM")],
    dateRanges: [],
  },
  {
    ...mockBase(5, "Landscape With Override Link"),
    overrideLink: "https://example.com",
    description:
      "This item has an external override link instead of an internal slug-based route.",
    images: [mockImage(5, "LANDSCAPE", "Override")],
    tags: [mockTag(5, 9, "MUSIC")],
    dateRanges: [mockDateRange(5)],
  },
  {
    ...mockBase(6, "No Image No Description"),
    images: [],
    tags: [],
    dateRanges: [],
  },
];

export const mockItemOrder = mockItems.map((i) => i.slug);

export const mockItemsData = {
  data: { items: mockItems, totalCount: mockItems.length },
  isLoading: false,
  isPending: false,
  isError: false,
  isSuccess: true,
} as unknown as UseQueryResult<GetItemsWithIncludesResponse>;
