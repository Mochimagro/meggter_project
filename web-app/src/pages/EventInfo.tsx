import EventInfoCard from "../components/EventInfoCard";
import { events } from "../entities/EventTestData";

export default function EventInfo() {
  const event = events.events[0];

  return (
    <>
      <h1>イベント情報</h1>
      <EventInfoCard {...event} />
    </>
  );
}
