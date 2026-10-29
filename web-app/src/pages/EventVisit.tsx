import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useParams } from "react-router";
import { Header } from "@/components/Header";
import EventVisitCircleCard from "@/components/EventVisitCircleCard";
import { useEventInfo } from "@/features/events/useEventInfo";

export default function EventVisit() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useEventInfo(eventId);

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
      </Container>
    </>
  );
}
