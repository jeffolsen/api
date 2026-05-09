import { bool, cleanEnv, email, port, str, url } from "envalid";
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
  // UPSTASH_REDIS_REST_URL: url({ desc: "Upstash Redis REST URL" }),
  // UPSTASH_REDIS_REST_TOKEN: str({ desc: "Upstash Redis REST Token" }),
  FEATURE_API_KEYS: bool({ default: false }),
});

export default env;
