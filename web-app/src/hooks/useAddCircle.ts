import {
  db,
  type Circle,
  type CircleVisit,
  type SyncQueueItem,
} from "@/db/database";

export function useAddCircle() {
  return async (eventId: string, circleId: string) => {
    const now = new Date().toISOString();
    const circle: Circle = {
      id: circleId,
      circleName: "",
      penName: null,
      genre: null,
      space: null,
      mapUrl: null,
      memo: null,
      createdAt: now,
      updatedAt: now,
    };
    const circleVisit: CircleVisit = {
      id: crypto.randomUUID(),
      eventId,
      circleId,
      priority: 0,
      visitedAt: null,
      status: "want_to_visit",
      memo: null,
    };

    await db.transaction(
      "rw",
      [db.circles, db.circle_visits, db.sync_queue],
      async () => {
        const existingVisits = await db.circle_visits
          .where("eventId")
          .equals(eventId)
          .toArray();
        circleVisit.priority =
          existingVisits.reduce(
            (highest, visit) => Math.max(highest, visit.priority),
            0,
          ) + 1;
        const syncQueueItems: SyncQueueItem[] = [
          {
            id: crypto.randomUUID(),
            clientId: "local-client",
            entity: "circles",
            entityId: circle.id,
            operation: "create",
            payload: circle,
            createdAt: now,
            syncedAt: null,
          },
          {
            id: crypto.randomUUID(),
            clientId: "local-client",
            entity: "circle_visits",
            entityId: circleVisit.id,
            operation: "create",
            payload: circleVisit,
            createdAt: now,
            syncedAt: null,
          },
        ];

        await db.circles.add(circle);
        await db.circle_visits.add(circleVisit);
        await db.sync_queue.bulkAdd(syncQueueItems);
      },
    );

    return circleId;
  };
}
