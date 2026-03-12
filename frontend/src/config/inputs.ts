const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NUMERIC_CODE_REGEX = /^\d{6}/;

import { FormComponentProps } from "../components/inputs/Input";

export const EMAIL_INPUT = {
  dataName: "email",
  displayName: "Email",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "Email is required",
      pattern: {
        value: EMAIL_REGEX,
        message: "Invalid Email format",
      },
    },
  },
} as FormComponentProps;
export const EMAIL_DEFAULT = { email: "" };

export const PASSWORD_INPUT = {
  dataName: "password",
  displayName: "Password",
  componentName: "TextInput",
  input: {
    element: {
      type: "password",
    },
    registerOpts: {
      required: "Password is required",
      pattern: {
        value: PASSWORD_REGEX,
        message: "Invalid password format",
      },
    },
  },
} as FormComponentProps;
export const PASSWORD_DEFAULT = { password: "" };

export const CONFIRM_PASSWORD_INPUT = {
  dataName: "confirmPassword",
  displayName: "Confirm Password",
  componentName: "TextInput",
  input: {
    element: {
      type: "password",
    },
    registerOpts: {
      required: "Confirm Password is required",
      pattern: {
        value: PASSWORD_REGEX,
        message: "Invalid password format",
      },
    },
  },
} as FormComponentProps;
export const CONFIRM_PASSWORD_DEFAULT = { confirmPassword: "" };

export const NEW_PASSWORD_INPUT = {
  dataName: "newPassword",
  displayName: "New Password",
  componentName: "TextInput",
  input: {
    element: {
      type: "password",
    },
    registerOpts: {
      required: "New Password is required",
      pattern: {
        value: PASSWORD_REGEX,
        message: "Invalid password format",
      },
    },
  },
} as FormComponentProps;
export const NEW_PASSWORD_DEFAULT = { newPassword: "" };

export const CONFIRM_NEW_PASSWORD_INPUT = {
  dataName: "confirmNewPassword",
  displayName: "Confirm New Password",
  componentName: "TextInput",
  input: {
    element: {
      type: "password",
    },
    registerOpts: {
      required: "Confirm New Password is required",
      pattern: {
        value: PASSWORD_REGEX,
        message: "Invalid password format",
      },
    },
  },
} as FormComponentProps;
export const CONFIRM_NEW_PASSWORD_DEFAULT = { confirmNewPassword: "" };

export const VERIFICATION_CODE_INPUT = {
  dataName: "verificationCode",
  displayName: "Verification Code",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "Verification Code is required",
      pattern: {
        value: NUMERIC_CODE_REGEX,
        message: "Invalid Verification Code format",
      },
    },
  },
} as FormComponentProps;
export const VERIFICATION_CODE_DEFAULT = { verificationCode: "" };

export const ORIGIN_INPUT = {
  dataName: "origin",
  displayName: "App Origin",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "App Origin is required",
    },
  },
} as FormComponentProps;
export const ORIGIN_DEFAULT = { origin: "" };

export const SLUG_INPUT = {
  dataName: "apiSlug",
  displayName: "Unique Slug",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "Unique Slug is required",
      pattern: {
        value: SLUG_REGEX,
        message: "Invalid Slug format",
      },
    },
  },
} as FormComponentProps;
export const SLUG_DEFAULT = { apiSlug: "" };

export const NAME_INPUT = {
  dataName: "name",
  displayName: "Name",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "Name is required",
    },
  },
} as FormComponentProps;
export const NAME_DEFAULT = { name: "" };

export const DESCRIPTION_INPUT = {
  dataName: "description",
  displayName: "Description",
  componentName: "TextInput",
  input: {
    registerOpts: {
      required: "Description is required",
    },
  },
} as FormComponentProps;
export const DESCRIPTION_DEFAULT = { description: "" };

export const CONTENT_INPUT = {
  dataName: "content",
  displayName: "Content",
  componentName: "TextAreaInput",
  input: {
    registerOpts: {
      required: "Content is required",
    },
  },
} as FormComponentProps;
export const CONTENT_DEFAULT = { content: "" };

export const IMAGE_IDS_INPUT = {
  dataName: "imageIds",
  displayName: "Images",
  componentName: "ImageSelectArrayInput",
  input: {
    rules: {
      maxLength: { value: 3, message: "You can select up to 3 images" },
    },
  },
} as FormComponentProps;
export const IMAGE_IDS_DEFAULT = { imageIds: [] as { imageId: number }[] };

export const TAGNAMES_INPUT = {
  dataName: "tagNames",
  displayName: "Tags",
  componentName: "TagArrayInput",
  input: {
    rules: { maxLength: { value: 3, message: "You can select up to 3 tags" } },
  },
} as FormComponentProps;
export const TAGNAMES_DEFAULT = { tagNames: [] as { tagname: string }[] };

export const tagnamesDefaultFromStrings = (tagnames: string[]) => ({
  tagNames: tagnames.map((tagname) => ({ tagname })),
});

import { CreateDateRange } from "../network/item";
export const DATE_RANGES_INPUT = {
  dataName: "dateRanges",
  displayName: "Date Ranges",
  componentName: "DateRangeArrayInput",
  inputGroup: {
    inputs: {
      startAt: {
        dataName: "startAt",
        displayName: "Start At",
        input: {
          element: {
            type: "datetime-local",
          },
          registerOpts: { required: "Start At is required" },
        },
      },
      endAt: {
        dataName: "endAt",
        displayName: "End At",
        input: {
          element: {
            type: "datetime-local",
          },
          registerOpts: { required: "End At is required" },
        },
      },
      description: {
        dataName: "description",
        displayName: "Description",
        input: {
          element: {
            type: "text",
          },
          registerOpts: { required: "Description is required" },
        },
      },
    },
    rules: {
      maxLength: { value: 3, message: "You can create up to 3 date ranges" },
    },
  },
} as FormComponentProps;
export const DATE_RANGES_DEFAULT = { dateRanges: [] as CreateDateRange[] };
