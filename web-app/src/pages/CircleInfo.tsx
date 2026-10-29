import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import CircleInfoListCard from "@/components/CircleInfoListCard";
import { Header } from "@/components/Header";
import { db } from "@/db/database";

export default function CircleInfo() {
  const { circleId } = useParams<{ circleId: string }>();
  const circleInfo = useLiveQuery(async () => {
    if (!circleId) {
      return null;
    }

    const circle = await db.circles.get(circleId);
    if (!circle) {
      return null;
    }

    const visits = await db.circle_visits
      .where("circleId")
      .equals(circleId)
      .sortBy("priority");
    const events = visits.length
      ? await db.events
          .where("id")
          .anyOf([...new Set(visits.map((visit) => visit.eventId))])
          .toArray()
      : [];
    const items = visits.length
      ? await db.wishlist_items
          .where("circleVisitId")
          .anyOf(visits.map((visit) => visit.id))
          .toArray()
      : [];
    const visitById = new Map(visits.map((visit) => [visit.id, visit]));
    const eventById = new Map(events.map((event) => [event.id, event]));

    return {
      circleName: circle.circleName,
      items: items.map((item) => {
        const visit = visitById.get(item.circleVisitId);
        const event = visit ? eventById.get(visit.eventId) : undefined;
        return {
          item,
          eventName: event?.name ?? "イベント名不明",
          priority: visit?.priority ?? 0,
        };
      }),
    };
  }, [circleId]);

  if (!circleId) {
    return <p>サークルが見つかりません。</p>;
  }
  if (circleInfo === undefined) {
    return <p>読み込み中…</p>;
  }
  if (circleInfo === null) {
    return <p>サークルが見つかりません。</p>;
  }

  return (
    <>
      <Header pageName="サークル情報" />
      <Container as="main" py={8}>
        <Stack gap={5}>
          <Heading size="2xl">{circleInfo.circleName}</Heading>
          {circleInfo.items.length === 0 ? (
            <Text>アイテムはまだ登録されていません。</Text>
          ) : (
            circleInfo.items
              .sort(
                (first, second) =>
                  first.priority - second.priority ||
                  first.eventName.localeCompare(second.eventName),
              )
              .map(({ item, eventName }) => (
                <CircleInfoListCard
                  key={item.id}
                  item={item}
                  eventName={eventName}
                />
              ))
          )}
        </Stack>
      </Container>
    </>
  );
}