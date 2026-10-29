import { Button, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { CircleCardProps } from "@/entities/CardEntities";
import {
  deferCircleVisit,
  markCircleVisited,
  undoCircleVisit,
} from "@/db/recordMutations";
import CircleItemCard from "./CircleItemCard";

type EventVisitCircleCardProps = CircleCardProps;

export default function EventVisitCircleCard({
  circleVisitId,
  visited,
  name,
  penName,
  space,
  books,
}: EventVisitCircleCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateVisit = async (action: typeof markCircleVisited) => {
    setIsSubmitting(true);
    setError("");
    try {
      await action(circleVisitId);
    } catch (cause) {
      console.error("サークルの巡回状態更新に失敗しました。", cause);
      setError("状態を更新できませんでした。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Header opacity={visited ? 0.5 : 1}>
        <Flex justify="space-between" align="start" gap={3} flexWrap="wrap">
          <Stack gap={1}>
            <Text fontSize="lg" fontWeight="bold">
              {space}
            </Text>
            <Heading size="xl">{name || "サークル名未設定"}</Heading>
            {penName && <Text>{penName}</Text>}
          </Stack>
          <Text
            fontWeight="bold"
            color={visited ? "green.600" : "gray.600"}
            aria-live="polite"
          >
            {visited ? "巡回済み" : "未巡回"}
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body opacity={visited ? 0.5 : 1}>
        <Stack>
          {books.map((book) => (
            <CircleItemCard key={book.id} {...book} visitActions />
          ))}
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end" flexWrap="wrap">
        {error && (
          <Text role="alert" color="red.600" marginRight="auto">
            {error}
          </Text>
        )}
        {visited ? (
          <Button
            type="button"
            colorPalette="orange"
            variant="outline"
            onClick={() => void updateVisit(undoCircleVisit)}
            disabled={isSubmitting}
          >
            やっぱめぐってない
          </Button>
        ) : (
          <>
            <Button
              type="button"
              colorPalette="gray"
              variant="outline"
              onClick={() => void updateVisit(deferCircleVisit)}
              disabled={isSubmitting}
            >
              後で
            </Button>
            <Button
              type="button"
              colorPalette="green"
              onClick={() => void updateVisit(markCircleVisited)}
              disabled={isSubmitting}
            >
              めぐった
            </Button>
          </>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
