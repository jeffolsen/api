export type TApiKey = {
  id: number;
  apiSlug: string;
  origin: string;
  createdAt: string;
  updatedAt: string;
};

export type TApiKeyInput = Omit<TApiKey, "id" | "createdAt" | "updatedAt">;

export type GenerateApiKeyInput = {
  apiSlug: string;
  origin: string;
  verificationCode: string;
};

export type DestroyApiKeyInput = {
  apiSlug: string;
  verificationCode: string;
};
