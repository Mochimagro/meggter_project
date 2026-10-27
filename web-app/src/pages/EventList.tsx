import EventCard from "../components/EventCard";
import type { EventCardInfoProps } from "../entities/CardEntities";

const event: EventCardInfoProps = {
  title: "イベント名",
  date: "2026年10月27日",
  circles: [
    {
      name: "サークル名",
      penName: "作家名",
      space: "A-01",
      totalPrice: 1000,
      books: [
        { title: "テスト同人誌タイトル", price: 500 },
        { title: "もう一冊の同人誌", price: 500 },
      ],
    },
    {
      name: "サークル2つ目",
      penName: "作家名",
      space: "A-02",
      totalPrice: 1000,
      books: [
        { title: "テスト同人誌タイトル", price: 500 },
        { title: "もう一冊の同人誌", price: 500 },
        { title: "もう一冊の同人誌", price: 500 },
        { title: "もう一冊の同人誌", price: 500 },
      ],
    },
  ],
};

export default function EventList() {
  return (
    <>
      <h1>イベント一覧</h1>
      <EventCard {...event} />
    </>
  );
}
