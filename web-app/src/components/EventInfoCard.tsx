import { Button, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAddCircle } from "@/hooks/useAddCircle";
import type { EventInfoCardProps } from "../entities/CardEntities";
import CircleCard from "./CircleCard";

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
  const [isAddingCircle, setIsAddingCircle] = useState(false);
  const [addError, setAddError] = useState("");
  const [animatedCircleIds, setAnimatedCircleIds] = useState<Set<string>>(
    () => new Set(),
  );
  const isAddingCircleRef = useRef(false);

  const handleAddCircle = async () => {
    if (isAddingCircleRef.current) {
      return;
    }

    isAddingCircleRef.current = true;
    setIsAddingCircle(true);
    setAddError("");
    const circleId = crypto.randomUUID();
    setAnimatedCircleIds((currentIds) => new Set(currentIds).add(circleId));

    try {
      await addCircle(eventId, circleId);
    } catch (error) {
      console.error("サークルの追加に失敗しました。", error);
      setAddError("サークルを追加できませんでした。再度お試しください。");
      setAnimatedCircleIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(circleId);
        return nextIds;
      });
    } finally {
      isAddingCircleRef.current = false;
      setIsAddingCircle(false);
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
        <Heading size="md">{title}</Heading>
        <Text>{date}</Text>
        {venue && <Text>会場・開催地：{venue}</Text>}
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
            <CircleCard
              key={circle.id}
              {...circle}
              isEntering={animatedCircleIds.has(circle.id)}
              onAnimationEnd={() => handleCircleAnimationEnd(circle.id)}
            />
          ))}
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button
          type="button"
          onClick={handleAddCircle}
          disabled={isAddingCircle}
        >
          {isAddingCircle ? "追加中..." : "サークル追加"}
        </Button>
        {addError && (
          <Text role="alert" color="red.600">
            {addError}
          </Text>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
