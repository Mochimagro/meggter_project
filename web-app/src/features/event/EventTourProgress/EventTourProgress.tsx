import { Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { CircleCardProps } from "@/entities/CardEntities";
import EventCircleList from "@/features/event/EventCircleList/EventCircleList";

export type EventTourProgressProps = {
  circles: CircleCardProps[];
  eventId?: string;
  showProgress?: boolean;
  children?: ReactNode;
};

export default function EventTourProgress({
  circles,
  eventId,
  showProgress = true,
  children,
}: EventTourProgressProps) {
  const [animatedCircleIds, setAnimatedCircleIds] = useState<Set<string>>(
    () => new Set(),
  );
  const hasInitializedCirclesRef = useRef(false);
  const previousCircleIdsRef = useRef(new Set<string>());
  const visitedCount = circles.filter((circle) => circle.visited).length;

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
    <Stack gap={4}>
      {showProgress && (
        <Text fontSize="xl" fontWeight="bold" aria-live="polite">
          巡回済みサークル数: {visitedCount} / {circles.length}
        </Text>
      )}
      {eventId ? (
        <EventCircleList
          eventId={eventId}
          circles={circles}
          animatedCircleIds={animatedCircleIds}
          onAnimationEnd={handleCircleAnimationEnd}
        />
      ) : (
        children
      )}
    </Stack>
  );
}
