import { Header } from "@/components/Header";
import AddEventButton from "@/components/AddEventButton";
import EventListContent from "@/components/EventListContent";

export default function TopPage() {
  return (
    <>
      <Header pageName="トップ"></Header>
      <EventListContent excludePastEvents />
      <AddEventButton />
    </>
  );
}
