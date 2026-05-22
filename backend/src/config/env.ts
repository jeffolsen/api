import { bool, cleanEnv, email, port, str } from "envalid";
import "dotenv/config";

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ALLOWED_ORIGIN: str(),
  EMAIL_SENDER: email(),
  RESEND_API_KEY: str(),
  ADMIN_USER: email(),
  REPORT_EMAIL: email(),
  FEATURE_API_KEYS: bool({ default: false }),
});

export default env;
