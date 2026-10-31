// イベントの状態をバッジで表示する。
import { Text } from "@chakra-ui/react";
import type { EventStatus } from "@/db/database";
import { semanticColors } from "@/theme/semanticColors";
import { getEventDateStatus } from "./eventDateStatus";

export type EventStatusBadgeProps = {
  date: string;
  status: EventStatus;
};

export default function EventStatusBadge({
  date,
  status,
}: EventStatusBadgeProps) {
  const dateStatus = getEventDateStatus(date);
  const label = status === "withdrawn" ? "撤退済み" : dateStatus.label;
  const isNegative = status === "withdrawn" || dateStatus.isPast;

  return (
    <Text
      position="absolute"
      top={3}
      left={3}
      fontWeight="bold"
      color={isNegative ? semanticColors.negative.text : "gray.600"}
    >
      {label}
    </Text>
  );
}
