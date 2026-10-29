import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import EventVisitCircleCard from "@/components/EventVisitCircleCard";
import { withdrawEvent } from "@/db/recordMutations";
import { useEventInfo } from "@/features/events/useEventInfo";

export default function EventVisit() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useEventInfo(eventId);
  const navigate = useNavigate();
  const [isWithdrawalConfirmationOpen, setIsWithdrawalConfirmationOpen] =
    useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState("");

  if (!eventId) {
    return <p>イベントが見つかりません。</p>;
  }
  if (event === undefined) {
    return <p>読み込み中…</p>;
  }
  if (event === null) {
    return <p>イベントが見つかりません。</p>;
  }

  const visitedCount = event.circles.filter((circle) => circle.visited).length;

  const handleWithdraw = async () => {
    if (isWithdrawing) {
      return;
    }

    setIsWithdrawing(true);
    setWithdrawalError("");
    try {
      await withdrawEvent(eventId);
      navigate(`/events/${encodeURIComponent(eventId)}/result`);
    } catch (cause) {
      console.error("イベントの撤退状態更新に失敗しました。", cause);
      setWithdrawalError(
        "撤退状態を更新できませんでした。再度お試しください。",
      );
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <Header pageName="イベント巡回管理 - EventVisit" />
      <Container as="main" py={8}>
        <Stack gap={5}>
          <Heading size="2xl">{event.title}</Heading>
          <Text fontSize="xl" fontWeight="bold" aria-live="polite">
            巡回済みサークル数: {visitedCount} / {event.circles.length}
          </Text>
          {event.circles.map((circle) => (
            <EventVisitCircleCard key={circle.circleVisitId} {...circle} />
          ))}
        </Stack>
        <Stack justifyContent="flex-end" flexWrap="wrap" py={8}>
          <Button
            type="button"
            colorPalette="orange"
            onClick={() => setIsWithdrawalConfirmationOpen(true)}
          >
            戦場を去る
          </Button>
        </Stack>
      </Container>
      {isWithdrawalConfirmationOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex="modal"
          display="grid"
          placeItems="center"
          background="blackAlpha.600"
          padding={4}
        >
          <Box
            as="section"
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdrawal-confirmation-title"
            background="white"
            color="gray.900"
            borderRadius="md"
            boxShadow="lg"
            maxWidth="md"
            padding={6}
            width="100%"
          >
            <Heading
              id="withdrawal-confirmation-title"
              size="lg"
              marginBottom={4}
            >
              再入場の予定はないですか？
            </Heading>
            <Text marginBottom={5}>
              ※以降、結果画面が表示されるようになります
            </Text>
            {withdrawalError && (
              <Text role="alert" color="red.600" marginBottom={4}>
                {withdrawalError}
              </Text>
            )}
            <Stack direction="row" justify="flex-end" gap={3}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawalConfirmationOpen(false)}
                disabled={isWithdrawing}
              >
                まだ頑張る
              </Button>
              <Button
                type="button"
                colorPalette="orange"
                onClick={() => void handleWithdraw()}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "保存中..." : "撤退する"}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
}
