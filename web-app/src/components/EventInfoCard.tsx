import { Button, Card, Heading, Flex, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAddCircle, type CircleSelection } from "@/hooks/useAddCircle";
import type { EventInfoCardProps } from "../entities/CardEntities";
import EventAddCirclrCard from "./EventAddCirclrCard";
import EventCircleListCard from "./EventCircleListCard";
import { BsMap } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";

type EventInfoCardComponentProps = EventInfoCardProps & { eventId: string };

export default function EventInfoCard({
  eventId,
  title,
  date,
  venue,
  entranceFee,
  transportationExpenses,
  circles,
}: EventInfoCardComponentProps) {
  const addCircle = useAddCircle();
  const [editingCircleId, setEditingCircleId] = useState<string | null>(null);
  const [animatedCircleIds, setAnimatedCircleIds] = useState<Set<string>>(
    () => new Set(),
  );
  const isAddingCircleRef = useRef(false);

  const handleAddCircle = async (selection: CircleSelection) => {
    if (isAddingCircleRef.current) {
      throw new Error("サークルを追加中です。");
    }

    isAddingCircleRef.current = true;

    try {
      const circleId = await addCircle(eventId, selection);
      setAnimatedCircleIds((currentIds) => new Set(currentIds).add(circleId));
      setEditingCircleId(null);
      return circleId;
    } catch (error) {
      console.error("サークルの追加に失敗しました。", error);
      throw error;
    } finally {
      isAddingCircleRef.current = false;
    }
  };

  const handleCircleAnimationEnd = (circleId: string) => {
    setAnimatedCircleIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(circleId);
      return nextIds;
    });
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="4xl">{title}</Heading>

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
      </Card.Header>
      <Card.Body>
        <Stack>
          {circles.map((circle) => (
            <EventCircleListCard
              key={circle.id}
              {...circle}
              isEntering={animatedCircleIds.has(circle.id)}
              onAnimationEnd={() => handleCircleAnimationEnd(circle.id)}
            />
          ))}
          {editingCircleId && (
            <EventAddCirclrCard
              onAdd={handleAddCircle}
              onCancel={() => setEditingCircleId(null)}
            />
          )}
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button
          type="button"
          onClick={() => setEditingCircleId(crypto.randomUUID())}
          disabled={editingCircleId !== null}
        >
          サークル追加
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
