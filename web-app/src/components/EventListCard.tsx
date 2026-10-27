import { Button, Card, Heading, Text } from "@chakra-ui/react";
import { isToday, parseISO } from "date-fns";
import type { EventListCardProps } from "../entities/CardEntities";

export default function EventListCard({ title, date }: EventListCardProps) {
  const dateParts = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  const isEventToday = dateParts
    ? isToday(
        parseISO(
          `${dateParts[1]}-${dateParts[2].padStart(2, "0")}-${dateParts[3].padStart(2, "0")}`,
        ),
      )
    : false;

  return (
    <Card.Root
      margin="8px"
      backgroundColor={isEventToday ? "red.400" : "colorPalette"}
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
          <Button margin="4px" backgroundColor={"blue.500"}>
            詳細
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
