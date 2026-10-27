import { Container } from "@chakra-ui/react";
import EventListCard from "../components/EventListCard";
import { events } from "../entities/EventTestData";

export default function EventList() {
  return (
    <Container as="main" py={8}>
      <h1>イベント一覧</h1>
      {events.events.map((event) => (
        <EventListCard
          key={`${event.title}-${event.date}`}
          title={event.title}
          date={event.date}
        />
      ))}
    </Container>
  );
}
