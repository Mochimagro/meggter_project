import EventInfoCard from "../components/EventInfoCard";
import { useParams } from "react-router";
import { useEventInfo } from "../features/events/useEventInfo";

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
      <h1>イベント情報</h1>
      <EventInfoCard {...event} />
    </>
  );
}
