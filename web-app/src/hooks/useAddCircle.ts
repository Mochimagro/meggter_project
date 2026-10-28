import {
  db,
  type Circle,
  type CircleVisit,
  type SyncQueueItem,
} from "@/db/database";

export type CircleSelection =
  | { circleId: string; space: string }
  | { circleName: string; penName?: string; space: string };

export class CircleAlreadyAddedError extends Error {
  constructor() {
    super("このイベントには選択したサークルが登録済みです。");
    this.name = "CircleAlreadyAddedError";
  }
}

export function useAddCircle() {
  return async (eventId: string, selection: CircleSelection) => {
    const now = new Date().toISOString();
    const isNewCircle = "circleName" in selection;
    const circleId = isNewCircle ? crypto.randomUUID() : selection.circleId;
    if (!selection.space.trim()) {
      throw new Error("スペース名を入力してください。");
    }
    const circle: Circle | null = isNewCircle
      ? {
          id: circleId,
          circleName: selection.circleName.trim(),
          penName: selection.penName?.trim() || null,
          genre: null,
          mapUrl: null,
          memo: null,
          createdAt: now,
          updatedAt: now,
        }
      : null;

    await db.transaction(
      "rw",
      [db.circles, db.circle_visits, db.sync_queue],
      async () => {
        const existingVisits = await db.circle_visits
          .where("eventId")
          .equals(eventId)
          .toArray();
        if (existingVisits.some((visit) => visit.circleId === circleId)) {
          throw new CircleAlreadyAddedError();
        }
        if (!isNewCircle && !(await db.circles.get(circleId))) {
          throw new Error("選択したサークルが見つかりません。");
        }

        const circleVisit: CircleVisit = {
          id: crypto.randomUUID(),
          eventId,
          circleId,
          priority:
            existingVisits.reduce(
              (highest, visit) => Math.max(highest, visit.priority),
              0,
            ) + 1,
          space: selection.space.trim(),
          visitedAt: null,
          status: "want_to_visit",
          memo: null,
        };
        const syncQueueItems: SyncQueueItem[] = [
          ...(circle
            ? [
                {
                  id: crypto.randomUUID(),
                  clientId: "local-client",
                  entity: "circles" as const,
                  entityId: circle.id,
                  operation: "create" as const,
                  payload: circle,
                  createdAt: now,
                  syncedAt: null,
                },
              ]
            : []),
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

        if (circle) {
          await db.circles.add(circle);
        }
        await db.circle_visits.add(circleVisit);
        await db.sync_queue.bulkAdd(syncQueueItems);
      },
    );

    return circleId;
  };
}
