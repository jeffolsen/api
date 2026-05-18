import { isAxiosError } from "axios";
import { UnauthorizedError, RateLimitError, NotFoundError } from "./errors";

const handleBlockError = (error: unknown) => {
  const err = isAxiosError(error) && error.response?.status;

  if (err === 429) throw new RateLimitError();
  else if (err === 401) throw new UnauthorizedError();
  throw new NotFoundError();
};

export default handleBlockError;
