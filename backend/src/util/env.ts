import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  PORT: port(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
});
