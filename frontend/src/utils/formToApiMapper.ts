export function convertTagnameArrayToStrings(
  tagArray: Array<{ name: string }>,
): string[] {
  return tagArray.map((tag) => tag.name);
}

export function convertStringsToTagnameArray(
  tagNames: string[],
): Array<{ name: string }> {
  return tagNames.map((name) => ({ name }));
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
