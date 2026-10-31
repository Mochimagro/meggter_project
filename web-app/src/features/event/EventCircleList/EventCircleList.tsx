// イベントに参加するサークルの一覧を表示する。
import { Stack } from "@chakra-ui/react";
import type { CircleCardProps } from "@/entities/CardEntities";
import EventCircleEntry from "./EventCircleEntry";

type EventCircleListProps = {
  eventId: string;
  circles: CircleCardProps[];
  animatedCircleIds: Set<string>;
  onAnimationEnd: (circleId: string) => void;
};

export default function EventCircleList({
  eventId,
  circles,
  animatedCircleIds,
  onAnimationEnd,
}: EventCircleListProps) {
  return (
    <Stack data-event-id={eventId}>
      {circles.map((circle) => (
        <EventCircleEntry
          key={circle.id}
          {...circle}
          isEntering={animatedCircleIds.has(circle.id)}
          onAnimationEnd={() => onAnimationEnd(circle.id)}
        />
      ))}
    </Stack>
  );
}
