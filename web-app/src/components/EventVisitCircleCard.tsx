import { Button, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import {
  deferCircleVisit,
  markCircleVisited,
  setWishlistItemStatus,
  undoCircleVisit,
} from "@/db/recordMutations";
import CircleItemCard from "./CircleItemCard";
import { semanticColors } from "@/theme/semanticColors";

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
  const isSubmittingRef = useRef(false);

  const updateVisit = async (action: typeof markCircleVisited) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      await action(circleVisitId);
    } catch (cause) {
      console.error("サークルの巡回状態更新に失敗しました。", cause);
      setError("状態を更新できませんでした。再度お試しください。");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const updateItemStatus = async (
    itemId: string,
    status: WishlistItemStatus,
  ) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      await setWishlistItemStatus(itemId, status);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root
      backgroundColor={visited ? semanticColors.positive.card : undefined}
    >
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
            color={visited ? semanticColors.positive.text : "gray.600"}
            aria-live="polite"
          >
            {visited ? "巡回済み" : "未巡回"}
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body opacity={visited ? 0.5 : 1}>
        <fieldset
          disabled={isSubmitting}
          style={{
            border: 0,
            margin: 0,
            minWidth: 0,
            padding: 0,
          }}
        >
          <Stack>
            {books.map((book) => (
              <CircleItemCard
                key={book.id}
                {...book}
                visitActions
                visited={visited}
                onStatusChange={updateItemStatus}
              />
            ))}
          </Stack>
        </fieldset>
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
              backgroundColor={semanticColors.positive.button}
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
