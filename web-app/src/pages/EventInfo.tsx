import EventInfoCard from "../components/EventInfoCard";
import { useParams } from "react-router";
import { useEventInfo } from "../features/events/useEventInfo";
import { Header } from "@/components/Header";

export default function EventInfo() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useEventInfo(eventId);

  if (event === undefined) {
    return <p>読み込み中…</p>;
  }

  if (event === null) {
    return <p>イベントが見つかりません。</p>;
  }

  return (
    <>
      <Header pageName="イベント情報"></Header>
      <EventInfoCard {...event} />
    </>
  );
}
