import EventCard from "../components/EventCard";
import CircleCard from "../components/CircleCard";
import BookCard from "../components/BookCard";

export default function EventList() {
  return (
    <>
      <h1>イベント一覧</h1>
      <EventCard></EventCard>
      <CircleCard></CircleCard>
      <BookCard></BookCard>
    </>
  );
}
