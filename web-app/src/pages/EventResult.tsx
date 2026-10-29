import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { WishlistItemStatus } from "@/db/database";
import EventResultCircleCard from "@/components/EventResultCircleCard";
import EventResultCheckedItemList from "@/components/EventResultCheckedItemList";
import { Header } from "@/components/Header";
import { setWishlistItemStatus } from "@/db/recordMutations";
import { useEventInfo } from "@/features/events/useEventInfo";

export default function EventResult() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useEventInfo(eventId);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  if (!eventId) {
    return <p>イベントが見つかりません。</p>;
  }
  if (event === undefined) {
    return <p>読み込み中…</p>;
  }
  if (event === null) {
    return <p>イベントが見つかりません。</p>;
  }

  const resultCircles = event.circles
    .map((circle) => ({
      ...circle,
      books: circle.books.filter((book) => book.status === "venue_unacquired"),
    }))
    .filter((circle) => circle.books.length > 0);
  const missedItemsCount = resultCircles.reduce(
    (count, circle) => count + circle.books.length,
    0,
  );

  const updateItemStatus = async (
    itemId: string,
    status: WishlistItemStatus,
  ) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      await setWishlistItemStatus(itemId, status);
    } catch (cause) {
      console.error("イベント結果の更新に失敗しました。", cause);
      setError("アイテムの状態を更新できませんでした。再度お試しください。");
      throw cause;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header pageName="イベント結果 - EventResult" />
      <Container as="main" py={8}>
        <Stack gap={5}>
          <Heading size="2xl">{event.title}</Heading>
          <Text fontSize="xl" fontWeight="bold">
            買い逃したアイテム: {missedItemsCount}
          </Text>
          {error && (
            <Text role="alert" color="red.600">
              {error}
            </Text>
          )}
          {resultCircles.map((circle) => (
            <EventResultCircleCard
              key={circle.circleVisitId}
              {...circle}
              disabled={isSubmitting}
              onStatusChange={updateItemStatus}
            />
          ))}
          {resultCircles.length === 0 && <Text>未チェック無し。</Text>}
          <EventResultCheckedItemList circles={event.circles} />
          <Button
            type="button"
            alignSelf="flex-end"
            onClick={() => navigate(`/`)}
          >
            トップページに戻る
          </Button>
        </Stack>
      </Container>
    </>
  );
}
