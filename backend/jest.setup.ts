import { config } from "dotenv";

// Feature flags default to enabled in tests so middleware is transparent
process.env.FEATURE_API_KEYS = "true";

// Load environment variables before running tests
config();
