import { Header } from "@/components/Header";
import EventList from "./EventList";

export default function TopPage() {
  return (
    <>
      <Header pageName="トップ"></Header>
      <EventList></EventList>
    </>
  );
}
