export function convertStringPropertyArrayToStrings(
  key: string,
  stringPropertyArray: Array<{ [key: string]: string }>,
): string[] {
  return stringPropertyArray.map((item) => item[key]);
}

export function convertStringsToStringPropertyArray(
  key: string,
  strings: string[],
): Array<{ [key: string]: string }> {
  return strings.map((str) => ({ [key]: str }));
}

export function convertIdArrayToNumbers(
  key: string,
  idArray: Array<{ [key: string]: number }>,
): number[] {
  return idArray.map((item) => item[key]);
}

export function convertNumbersToIdArray(
  key: string,
  ids: number[],
): Array<{ [key: string]: number }> {
  return ids.map((id) => ({ [key]: id }));
}
