import { Header } from "@/components/Header";
import EventAddButton from "@/features/event/EventAddButton";
import EventListFeature from "@/features/event/EventList";

export default function TopPage() {
  return (
    <>
      <Header pageName="トップ - 開催前イベント"></Header>
      <EventListFeature excludePastEvents />
      <EventAddButton />
    </>
  );
}
