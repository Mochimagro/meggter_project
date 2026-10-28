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
      eventId,
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
      circleId: circle.id,
      visitedAt: null,
      status: "want_to_visit",
      memo: null,
    };
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

    await db.transaction(
      "rw",
      [db.circles, db.circle_visits, db.sync_queue],
      async () => {
        await db.circles.add(circle);
        await db.circle_visits.add(circleVisit);
        await db.sync_queue.bulkAdd(syncQueueItems);
      },
    );

    return circle.id;
  };
}
