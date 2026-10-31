import { Button, Container, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { WishlistItemStatus } from "@/db/database";
import { Header } from "@/components/Header";
import { useEventInfo } from "@/hooks/useEventInfo";
import EventCard from "@/features/event/EventCard";
import EventResultSummary from "@/features/event/EventResultSummary";
import { setWishlistItemStatus } from "@/db/recordMutations";

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
        <EventCard
          eventId={eventId}
          title={event.title}
          date={event.date}
          venue={event.venue ?? ""}
          entranceFee={event.entranceFee}
          transportationExpenses={event.transportationExpenses}
          actions={
            <Button
              type="button"
              alignSelf="flex-end"
              onClick={() => navigate(`/`)}
            >
              トップページに戻る
            </Button>
          }
        >
          <Stack gap={5}>
            <EventResultSummary
              circles={event.circles}
              disabled={isSubmitting}
              onStatusChange={updateItemStatus}
              error={error}
            />
          </Stack>
        </EventCard>
      </Container>
    </>
  );
}
