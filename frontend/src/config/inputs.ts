const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NUMERIC_CODE_REGEX = /^\d{6}/;

import { Field } from "../components/forms/Form";

export const EMAIL_INPUT = {
  name: "email",
  placeholder: "Email",
  label: "Email",
  type: "text",
  componentName: "TextInput",
  registerOptions: {
    required: "Email is required",
    pattern: {
      value: EMAIL_REGEX,
      message: "Invalid Email format",
    },
  },
} as Field;
export const EMAIL_DEFAULT = { email: "" };

export const PASSWORD_INPUT = {
  name: "password",
  placeholder: "Password",
  label: "Password",
  type: "password",
  componentName: "TextInput",
  registerOptions: {
    required: "Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Password format",
    },
  },
} as Field;
export const PASSWORD_DEFAULT = { password: "" };

export const CONFIRM_PASSWORD_INPUT = {
  name: "confirmPassword",
  placeholder: "Confirm Password",
  label: "Confirm Password",
  type: "password",
  componentName: "TextInput",
  registerOptions: {
    required: "Confirm Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Confirm Password format",
    },
  },
} as Field;
export const CONFIRM_PASSWORD_DEFAULT = { confirmPassword: "" };

export const NEW_PASSWORD_INPUT = {
  name: "newPassword",
  placeholder: "New Password",
  label: "New Password",
  type: "password",
  componentName: "TextInput",
  registerOptions: {
    required: "New Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Password format",
    },
  },
} as Field;
export const NEW_PASSWORD_DEFAULT = { newPassword: "" };

export const CONFIRM_NEW_PASSWORD_INPUT = {
  name: "confirmNewPassword",
  placeholder: "Confirm New Password",
  label: "Confirm New Password",
  type: "password",
  componentName: "TextInput",
  registerOptions: {
    required: "Confirm New Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Confirm Password format",
    },
  },
} as Field;
export const CONFIRM_NEW_PASSWORD_DEFAULT = { confirmNewPassword: "" };

export const VERIFICATION_CODE_INPUT = {
  name: "verificationCode",
  placeholder: "Verification Code",
  label: "Verification Code",
  type: "text",
  componentName: "TextInput",
  registerOptions: {
    required: "Verification Code is required",
    pattern: {
      value: NUMERIC_CODE_REGEX,
      message: "Invalid Verification Code format",
    },
  },
} as Field;
export const VERIFICATION_CODE_DEFAULT = { verificationCode: "" };

export const ORIGIN_INPUT = {
  name: "origin",
  placeholder: "origin",
  label: "App Origin",
  type: "text",
  componentName: "TextInput",
  registerOptions: {
    required: "App Origin is required",
  },
} as Field;
export const ORIGIN_DEFAULT = { origin: "" };

export const SLUG_INPUT = {
  name: "apiSlug",
  placeholder: "slug",
  label: "Unique Slug",
  type: "text",
  componentName: "TextInput",
  registerOptions: {
    required: "Unique Slug is required",
    pattern: {
      value: SLUG_REGEX,
      message: "Invalid Slug format",
    },
  },
} as Field;
export const SLUG_DEFAULT = { apiSlug: "" };

export const TITLE_INPUT = {
  name: "title",
  placeholder: "Title",
  label: "Title",
  type: "text",
  componentName: "TextInput",
  registerOptions: { required: "Title is required" },
} as Field;
export const TITLE_DEFAULT = { title: "" };

export const SUBTITLE_INPUT = {
  name: "subtitle",
  placeholder: "Subtitle",
  label: "Subtitle",
  type: "text",
  componentName: "TextInput",
  registerOptions: {},
} as Field;
export const SUBTITLE_DEFAULT = { subtitle: "" };

export const CONTENT_INPUT = {
  name: "content",
  placeholder: "Content",
  label: "Content",
  type: "textarea",
  componentName: "TextAreaInput",
  registerOptions: {},
} as Field;
export const CONTENT_DEFAULT = { content: "" };

export const IMAGE_IDS_INPUT = {
  name: "imageIds",
  placeholder: "Image IDs",
  label: "Image IDs",
  type: "hidden",
  componentName: "ImageSelectInput",
  rules: { maxLength: { value: 3, message: "You can select up to 3 images" } },
} as Field;
export const IMAGE_IDS_DEFAULT = { imageIds: [] as { imageId: number }[] };

export const TAGNAMES_INPUT = {
  name: "tagNames",
  placeholder: "Tag Names",
  label: "Tag Names",
  type: "hidden",
  componentName: "TagArrayInput",
  rules: { maxLength: { value: 3, message: "You can select up to 3 tags" } },
} as Field;
export const TAGNAMES_DEFAULT = { tagNames: [] as { tagname: string }[] };

export const tagnamesDefaultFromStrings = (tagnames: string[]) => ({
  tagNames: tagnames.map((tagname) => ({ tagname })),
});

import { CreateDateRange } from "../network/item";
export const DATE_RANGES_INPUT = {
  name: "dateRanges",
  label: "Date Ranges",
  componentName: "DateRangeSelectInput",
  registerOptions: { required: true },
  rules: { maxLength: { value: 3, message: "You can select up to 3 tags" } },
} as Field;
export const DATE_RANGES_DEFAULT = { dateRanges: [] as CreateDateRange[] };
