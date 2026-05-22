import { CodeType } from "@db/client";

type TEMPLATES = Record<CodeType, (topic: CodeType, code: string) => string>;

const SITE_NAME = "meetjeffolsen.com";

const footer = `
  <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
  <p style="font-size: 12px; color: #888;">
    This code was requested for your ${SITE_NAME} CMS demo account. Your email is only used to send login codes and will be permanently deleted with your account after 7 days. You can delete your account earlier from your profile dashboard. This is a demonstration service — not for commercial use.
  </p>`;

const loginTemplate = (_topic: CodeType, code: string) => `
  <p>Thanks for taking an interest in my work! Here's your one-time login code for the ${SITE_NAME} CMS demo.</p>
  <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
  <p style="font-size: 13px; color: #555;">This code expires shortly and can only be used once. If you didn't request this, you can ignore this email.</p>
  ${footer}`;

const logoutAllTemplate = (_topic: CodeType, code: string) => `
  <p>A request was made to sign out of all active sessions on your ${SITE_NAME} CMS demo account.</p>
  <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
  <p style="font-size: 13px; color: #555;">If you didn't request this, your account may be compromised. Sign in and change your password immediately.</p>
  ${footer}`;

const passwordResetTemplate = (_topic: CodeType, code: string) => `
  <p>A password reset was requested for your ${SITE_NAME} CMS demo account.</p>
  <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
  <p style="font-size: 13px; color: #555;">If you didn't request this, you can ignore this email.</p>
  ${footer}`;

const deleteProfileTemplate = (_topic: CodeType, code: string) => `
  <p>A request was made to permanently delete your ${SITE_NAME} CMS demo account and all associated content.</p>
  <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
  <p style="font-size: 13px; color: #555;">This action cannot be undone. If you didn't request this, sign in immediately to secure your account.</p>
  ${footer}`;

const createApiKeyTemplate = (_topic: CodeType, code: string) => `
  <p>Your API key management code for ${SITE_NAME}.</p>
  <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
  ${footer}`;

const templates: TEMPLATES = {
  LOGIN: loginTemplate,
  LOGOUT_ALL: logoutAllTemplate,
  PASSWORD_RESET: passwordResetTemplate,
  DELETE_PROFILE: deleteProfileTemplate,
  CREATE_API_KEY: createApiKeyTemplate,
};

export default templates;
