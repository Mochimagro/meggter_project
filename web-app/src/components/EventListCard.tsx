import { Button, Card, Heading, Text } from "@chakra-ui/react";
import { isBefore, isToday, isValid, parseISO, startOfToday } from "date-fns";
import type { EventListCardProps } from "../entities/CardEntities";
import { useNavigate } from "react-router";

export default function EventListCard({ id, title, date }: EventListCardProps) {
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const japaneseDate = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  const dateToCheck = isoDate
    ? date
    : japaneseDate
      ? `${japaneseDate[1]}-${japaneseDate[2].padStart(2, "0")}-${japaneseDate[3].padStart(2, "0")}`
      : null;
  const parsedDate = dateToCheck ? parseISO(dateToCheck) : null;
  const isValidEventDate = parsedDate !== null && isValid(parsedDate);
  const isEventToday = isValidEventDate && isToday(parsedDate);
  const isPastEvent =
    isValidEventDate && isBefore(parsedDate, startOfToday());
  const navigate = useNavigate();
  return (
    <Card.Root
      margin="8px"
      backgroundColor={
        isPastEvent ? "gray.400" : isEventToday ? "red.400" : "colorPalette"
      }
    >
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{date}</Text>
      </Card.Header>
      <Card.Footer justifyContent="flex-end">
        {isEventToday ? (
          <Button margin="4px" backgroundColor={"red.500"}>
            巡る
          </Button>
        ) : (
          <Button
            onClick={() => navigate(`/events/${encodeURIComponent(id)}`)}
            margin="4px"
            backgroundColor={"blue.500"}
          >
            詳細
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
