import { Flex, Stack, Text } from "@chakra-ui/react";
import { BsMap } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";

export type EventScheduleProps = {
  date: string;
  venue: string;
  entranceFee?: number | null;
  transportationExpenses?: number | null;
};

export default function EventSchedule({
  date,
  venue,
  entranceFee,
  transportationExpenses,
}: EventScheduleProps) {
  return (
    <Stack gap={2}>
      <Flex align="center" gap={2}>
        <FaCalendarAlt />
        <Text>{date}</Text>
      </Flex>
      <Flex align="center" gap={2}>
        <BsMap />
        <Text>{venue}</Text>
      </Flex>
      {entranceFee != null && (
        <Text>参加費：{entranceFee.toLocaleString()}円</Text>
      )}
      {transportationExpenses != null && (
        <Text>交通費：{transportationExpenses.toLocaleString()}円</Text>
      )}
    </Stack>
  );
}
