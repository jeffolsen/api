const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NUMERIC_CODE_REGEX = /^\d{6}/;

export const EMAIL_INPUT = {
  name: "email",
  placeholder: "Email",
  type: "text",
  registerOptions: {
    required: "Email is required",
    pattern: {
      value: EMAIL_REGEX,
      message: "Invalid Email format",
    },
  },
};
export const EMAIL_DEFAULT = { email: "" };

export const PASSWORD_INPUT = {
  name: "password",
  placeholder: "Password",
  type: "text",
  registerOptions: {
    required: "Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Password format",
    },
  },
};
export const PASSWORD_DEFAULT = { password: "" };

export const CONFIRM_PASSWORD_INPUT = {
  name: "confirmPassword",
  placeholder: "Confirm Password",
  type: "text",
  registerOptions: {
    required: "Confirm Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Invalid Confirm Password format",
    },
  },
};
export const CONFIRM_PASSWORD_DEFAULT = { confirmPassword: "" };

export const VERIFICATION_CODE_INPUT = {
  name: "code",
  placeholder: "Verification Code",
  type: "text",
  registerOptions: {
    required: "Verification Code is required",
    pattern: {
      value: NUMERIC_CODE_REGEX,
      message: "Invalid Verification Code format",
    },
  },
};
export const VERIFICATION_CODE_DEFAULT = { code: "" };

export const ORIGIN_INPUT = {
  name: "origin",
  placeholder: "origin",
  type: "text",
  registerOptions: {
    required: "App Origin is required",
  },
};
export const ORIGIN_DEFAULT = { code: "" };

export const SLUG_INPUT = {
  name: "apiSlug",
  placeholder: "slug",
  type: "text",
  registerOptions: {
    required: "Unique Slug is required",
    pattern: {
      value: SLUG_REGEX,
      message: "Invalid Slug format",
    },
  },
};
export const SLUG_DEFAULT = { code: "" };
