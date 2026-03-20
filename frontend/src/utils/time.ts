export const convertLocalDateTimeToZulu = (localDateTime: string) => {
  const date = new Date(localDateTime);
  return date.toISOString();
};

export const convertZuluToLocalDateTime = (zuluDateTime: string) => {
  const date = new Date(zuluDateTime);
  const timezoneOffsetInMinutes = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - timezoneOffsetInMinutes);
  return date.toISOString().slice(0, 16);
};
