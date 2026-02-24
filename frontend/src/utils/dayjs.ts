import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(advancedFormat);
dayjs.extend(isToday);

export const longDatetime = "MMMM Do, YYYY h:mm A";
export const longDate = "dddd, MMMM Do, YYYY";
export const shortDate = "M-D-YY";
export const techDatetime = "YYYY-MM-DD HH:mm:ss";

export default dayjs;
