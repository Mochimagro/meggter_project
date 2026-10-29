import { Container } from "@chakra-ui/react";
import { useEvents } from "@/features/events/useEvents";
import EventListCard from "./EventListCard";

type EventListContentProps = {
  excludePastEvents?: boolean;
};

export default function EventListContent({
  excludePastEvents = false,
}: EventListContentProps) {
  const events = useEvents(excludePastEvents);

  if (!events) {
    return <p>読み込み中…</p>;
  }

  return (
    <Container as="main" py={8}>
      {events.map((event) => (
        <EventListCard
          key={event.id}
          id={event.id}
          title={event.name}
          date={event.eventDate}
          venue={event.venue}
          status={event.status}
        />
      ))}
    </Container>
  );
}
