import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export const longFormat = "MMMM Do, YYYY h:mm A";
export const shortFormat = "M-D-YY";
export const techFormat = "YYYY-MM-DD HH:mm:ss";

export default dayjs;
