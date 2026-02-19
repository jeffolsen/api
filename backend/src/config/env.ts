import { cleanEnv, email, port, str } from "envalid";
import "dotenv/config";

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ALLOWED_ORIGIN: str(),
  RESEND_API_KEY: str(),
  EMAIL_SENDER: email(),
});

export default env;
