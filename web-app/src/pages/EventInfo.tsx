import EventInfoCard from "../components/EventInfoCard";
import { useParams } from "react-router";
import { useEventInfo } from "../hooks/useEventInfo";
import { Header } from "@/components/Header";
import { Container } from "@chakra-ui/react";

export default function EventInfo() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useEventInfo(eventId);

  if (!eventId) {
    return <p>イベントが見つかりません。</p>;
  }

  if (event === undefined) {
    return <p>読み込み中…</p>;
  }

  if (event === null) {
    return <p>イベントが見つかりません。</p>;
  }

  return (
    <>
      <Header pageName="イベント情報"></Header>
      <Container as="main" py={8}>
        <EventInfoCard eventId={eventId} {...event} />
      </Container>
    </>
  );
}
