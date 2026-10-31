import { Container } from "@chakra-ui/react";
import { useEvents } from "@/hooks/useEvents";
import EventListCard from "../EventListCard/EventListCard";

export type EventListProps = {
  excludePastEvents?: boolean;
};

export default function EventList({
  excludePastEvents = false,
}: EventListProps) {
  const events = useEvents(excludePastEvents);

  if (!events) {
    return <p>読み込み中…</p>;
  }

  const sortedEvents = [...events].sort((first, second) =>
    second.eventDate.localeCompare(first.eventDate),
  );

  return (
    <Container as="main" py={8}>
      {sortedEvents.map((event) => (
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
