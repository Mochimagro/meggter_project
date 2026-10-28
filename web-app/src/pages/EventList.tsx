import AddEventButton from "@/components/AddEventButton";
import EventListContent from "@/components/EventListContent";
import { Header } from "@/components/Header";

export default function EventList() {
  return (
    <>
      <Header pageName="イベント管理" />
      <EventListContent />
      <AddEventButton />
    </>
  );
}
