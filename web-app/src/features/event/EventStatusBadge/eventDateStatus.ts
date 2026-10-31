import { isBefore, isToday, isValid, parseISO, startOfToday } from "date-fns";

type EventDateStatus = {
  isToday: boolean;
  isPast: boolean;
  label: string;
};

export function getEventDateStatus(date: string): EventDateStatus {
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const japaneseDate = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  const dateToCheck = isoDate
    ? date
    : japaneseDate
      ? `${japaneseDate[1]}-${japaneseDate[2].padStart(2, "0")}-${japaneseDate[3].padStart(2, "0")}`
      : null;
  const parsedDate = dateToCheck ? parseISO(dateToCheck) : null;
  const isValidEventDate = parsedDate !== null && isValid(parsedDate);
  const today = isValidEventDate && isToday(parsedDate);
  const past = isValidEventDate && isBefore(parsedDate, startOfToday());

  return {
    isToday: today,
    isPast: past,
    label: past ? "終了" : today ? "当日" : "開催前",
  };
}
