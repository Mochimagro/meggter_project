import { db, type Event, type SyncQueueItem } from "@/db/database";

type NewEvent = Pick<
  Event,
  "name" | "eventDate" | "venue" | "entranceFee" | "transportationExpenses"
>;

export function useAddEvent() {
  return async (newEvent: NewEvent) => {
    const now = new Date().toISOString();
    const event: Event = {
      id: crypto.randomUUID(),
      userId: null,
      name: newEvent.name.trim(),
      eventDate: newEvent.eventDate,
      venue: newEvent.venue?.trim() || null,
      entranceFee: newEvent.entranceFee ?? null,
      transportationExpenses: newEvent.transportationExpenses ?? null,
      memo: null,
      createdAt: now,
      updatedAt: now,
    };
    const syncQueueItem: SyncQueueItem = {
      id: crypto.randomUUID(),
      clientId: "local-client",
      entity: "events",
      entityId: event.id,
      operation: "create",
      payload: event,
      createdAt: now,
      syncedAt: null,
    };

    await db.transaction("rw", [db.events, db.sync_queue], async () => {
      await db.events.add(event);
      await db.sync_queue.add(syncQueueItem);
    });

    return event.id;
  };
}
