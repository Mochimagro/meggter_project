import { Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { CircleCardProps } from "@/entities/CardEntities";
import EventCircleListCard from "@/components/EventCircleListCard";

type EventCircleListProps = {
  eventId: string;
  circles: CircleCardProps[];
};

export default function EventCircleList({
  eventId,
  circles,
}: EventCircleListProps) {
  const [animatedCircleIds, setAnimatedCircleIds] = useState<Set<string>>(
    () => new Set(),
  );
  const hasInitializedCirclesRef = useRef(false);
  const previousCircleIdsRef = useRef(new Set<string>());

  useEffect(() => {
    const circleIds = new Set(circles.map((circle) => circle.id));
    if (!hasInitializedCirclesRef.current) {
      hasInitializedCirclesRef.current = true;
      previousCircleIdsRef.current = circleIds;
      return;
    }

    const addedCircleIds = [...circleIds].filter(
      (circleId) => !previousCircleIdsRef.current.has(circleId),
    );
    if (addedCircleIds.length > 0) {
      setAnimatedCircleIds((currentIds) => {
        const nextIds = new Set(currentIds);
        addedCircleIds.forEach((circleId) => nextIds.add(circleId));
        return nextIds;
      });
    }
    previousCircleIdsRef.current = circleIds;
  }, [circles]);

  const handleCircleAnimationEnd = (circleId: string) => {
    setAnimatedCircleIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(circleId);
      return nextIds;
    });
  };

  return (
    <Stack data-event-id={eventId}>
      {circles.map((circle) => (
        <EventCircleListCard
          key={circle.id}
          {...circle}
          isEntering={animatedCircleIds.has(circle.id)}
          onAnimationEnd={() => handleCircleAnimationEnd(circle.id)}
        />
      ))}
    </Stack>
  );
}
