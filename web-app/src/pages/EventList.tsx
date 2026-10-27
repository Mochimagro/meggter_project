import { Container } from "@chakra-ui/react";
import EventListCard from "../components/EventListCard";
import { useEvents } from "@/features/events/useEvents";

export default function EventList() {
  const events = useEvents();

  if (!events) return <p>読み込み中…</p>;

  return (
    <Container as="main" py={8}>
      <h1>イベント一覧</h1>
      {events.map((event) => (
        <EventListCard
          key={event.id}
          title={event.name}
          date={event.eventDate}
        />
      ))}
    </Container>
  );
}
