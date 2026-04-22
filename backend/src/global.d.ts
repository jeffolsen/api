declare global {
  namespace Express {
    interface Request {
      profileId: number;
      sessionId: number;
      scope: string;
    }
  }
}
export {};
