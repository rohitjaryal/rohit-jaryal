import dayjs from "dayjs";

export const getHumanReadableDate = (date: string) => {
  return dayjs(date).format("MMMM DD, YYYY hh:mm A");
};
