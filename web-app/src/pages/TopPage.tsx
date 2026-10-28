import { Header } from "@/components/Header";
import EventList from "./EventList";
import AddEventButton from "@/components/AddEventButton";

export default function TopPage() {
  return (
    <>
      <Header pageName="トップ"></Header>
      <EventList></EventList>
      <AddEventButton />
    </>
  );
}
