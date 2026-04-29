import { ImageType } from "@/db/client";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

export const mockImage = {
  id: 1,
  url: "https://site.com/image.jpg",
  alt: null,
  type: ImageType.OTHER,
  createdAt: new Date(),
  updatedAt: new Date(),
};
