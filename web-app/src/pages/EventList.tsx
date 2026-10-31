import EventAddButton from "@/features/event/EventAddButton";
import EventListFeature from "@/features/event/EventList";
import { Header } from "@/components/Header";

export default function EventList() {
  return (
    <>
      <Header pageName="イベント管理" />
      <EventListFeature />
      <EventAddButton />
    </>
  );
}
