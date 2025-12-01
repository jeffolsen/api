import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds: number = 10) =>
  bcrypt.hash(value, saltRounds);

export const compareValue = async (value: string, hash: string) =>
  bcrypt.compare(value, hash).catch(() => false);
