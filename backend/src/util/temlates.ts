import { CodeType } from "../db/client";

type TEMPLATES = Record<CodeType, (topic: CodeType, code: string) => string>;

const loginTemplate = (
  topic: CodeType,
  code: string
) => `<p>Congrats on sending your email!</p>
  <p>${topic}: <strong>${code}</strong></p>`;

const logoutAllTemplate = (
  topic: CodeType,
  code: string
) => `<p>Congrats on sending your email!</p>
  <p>${topic}: <strong>${code}</strong></p>`;

const passwordResetTemplate = (
  topic: CodeType,
  code: string
) => `<p>Congrats on sending your email!</p>
  <p>${topic}: <strong>${code}</strong></p>`;

const deleteProfileTemplate = (
  topic: CodeType,
  code: string
) => `<p>Congrats on sending your email!</p>
  <p>${topic}: <strong>${code}</strong></p>`;

const createApiKeyTemplate = (
  topic: CodeType,
  code: string
) => `<p>Congrats on sending your email!</p>
  <p>${topic}: <strong>${code}</strong></p>`;

const templates: TEMPLATES = {
  LOGIN: loginTemplate,
  LOGOUT_ALL: logoutAllTemplate,
  PASSWORD_RESET: passwordResetTemplate,
  DELETE_PROFILE: deleteProfileTemplate,
  CREATE_API_KEY: createApiKeyTemplate,
};

export default templates;
