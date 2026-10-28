import Dexie, { type EntityTable } from "dexie";

export type VisitStatus = "want_to_visit" | "visited" | "skipped";
export type SyncOperation = "create" | "update" | "delete";
export type SyncEntity =
  | "events"
  | "circles"
  | "circle_visits"
  | "wishlist_items";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Event {
  id: string;
  userId: string | null;
  name: string;
  eventDate: string;
  venue: string | null;
  entranceFee?: number | null;
  transportationExpenses?: number | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Circle {
  id: string;
  circleName: string;
  penName: string | null;
  genre: string | null;
  circleURL: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CircleVisit {
  id: string;
  eventId: string;
  circleId: string;
  priority: number;
  space: string;
  visitedAt: string | null;
  status: VisitStatus;
  memo: string | null;
}

export interface WishlistItem {
  id: string;
  circleId: string;
  circleVisitId: string;
  title: string;
  type: string | null;
  price: number | null;
  quantity: number;
  purchased: boolean;
  purchasedAt: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  clientId: string;
  entity: SyncEntity;
  entityId: string;
  operation: SyncOperation;
  payload: unknown;
  createdAt: string;
  syncedAt: string | null;
}

export const db = new Dexie("meggter_db") as Dexie & {
  users: EntityTable<User, "id">;
  events: EntityTable<Event, "id">;
  circles: EntityTable<Circle, "id">;
  circle_visits: EntityTable<CircleVisit, "id">;
  wishlist_items: EntityTable<WishlistItem, "id">;
  sync_queue: EntityTable<SyncQueueItem, "id">;
};

db.version(1).stores({
  users: "id, email, name, createdAt",
  events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
  circles:
    "id, eventId, circleName, penName, genre, space, createdAt, updatedAt",
  circle_visits: "id, circleId, visitedAt, status",
  wishlist_items:
    "id, circleId, title, type, purchased, purchasedAt, createdAt, updatedAt",
  sync_queue: "id, clientId, entity, entityId, operation, createdAt, syncedAt",
});

db.version(2)
  .stores({
    users: "id, email, name, createdAt",
    events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
    circles:
      "id, eventId, priority, circleName, penName, genre, space, createdAt, updatedAt",
    circle_visits: "id, circleId, visitedAt, status",
    wishlist_items:
      "id, circleId, title, type, purchased, purchasedAt, createdAt, updatedAt",
    sync_queue:
      "id, clientId, entity, entityId, operation, createdAt, syncedAt",
  })
  .upgrade(async (transaction) => {
    const circles = await transaction
      .table("circles")
      .toCollection()
      .sortBy("createdAt");
    const prioritiesByEvent = new Map<string, number>();

    for (const circle of circles) {
      const priority = (prioritiesByEvent.get(circle.eventId) ?? 0) + 1;
      prioritiesByEvent.set(circle.eventId, priority);
      await transaction.table("circles").update(circle.id, { priority });
    }
  });

db.version(3)
  .stores({
    users: "id, email, name, createdAt",
    events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
    circles: "id, circleName, penName, genre, space, createdAt, updatedAt",
    circle_visits:
      "id, eventId, circleId, priority, &[eventId+priority], visitedAt, status",
    wishlist_items:
      "id, circleVisitId, title, type, purchased, purchasedAt, createdAt, updatedAt",
    sync_queue:
      "id, clientId, entity, entityId, operation, createdAt, syncedAt",
  })
  .upgrade(async (transaction) => {
    const circleTable = transaction.table("circles");
    const visitTable = transaction.table("circle_visits");
    const wishlistTable = transaction.table("wishlist_items");
    const syncQueueTable = transaction.table("sync_queue");
    const circles = await circleTable.toArray();
    const visits = await visitTable.toArray();
    const circleById = new Map(
      circles.map((circle) => [circle.id, circle]),
    );
    const visitsByEvent = new Map<string, Array<Record<string, unknown>>>();
    const visitByCircle = new Map<string, Record<string, unknown>>();
    const visitById = new Map<string, Record<string, unknown>>();

    for (const visit of visits) {
      const circle = circleById.get(visit.circleId);
      if (!circle) {
        throw new Error(
          `Cannot migrate circle visit ${visit.id}: circle ${visit.circleId} was not found.`,
        );
      }

      const eventVisits = visitsByEvent.get(circle.eventId) ?? [];
      eventVisits.push({ ...visit, eventId: circle.eventId });
      visitsByEvent.set(circle.eventId, eventVisits);
    }

    for (const circle of circles) {
      const eventVisits = visitsByEvent.get(circle.eventId) ?? [];
      if (!eventVisits.some((visit) => visit.circleId === circle.id)) {
        eventVisits.push({
          id: crypto.randomUUID(),
          eventId: circle.eventId,
          circleId: circle.id,
          visitedAt: null,
          status: "want_to_visit",
          memo: null,
          createdAt: circle.createdAt,
          legacyPriority: circle.priority,
        });
        visitsByEvent.set(circle.eventId, eventVisits);
      }
    }

    for (const [eventId, eventVisits] of visitsByEvent) {
      eventVisits.sort((first, second) => {
        const firstCircle = circleById.get(first.circleId as string);
        const secondCircle = circleById.get(second.circleId as string);
        const firstPriority =
          (first.legacyPriority as number | undefined) ??
          (firstCircle?.priority as number | undefined) ??
          0;
        const secondPriority =
          (second.legacyPriority as number | undefined) ??
          (secondCircle?.priority as number | undefined) ??
          0;
        return (
          firstPriority - secondPriority ||
          String(firstCircle?.createdAt ?? "").localeCompare(
            String(secondCircle?.createdAt ?? ""),
          ) ||
          String(first.id).localeCompare(String(second.id))
        );
      });

      for (const [index, visit] of eventVisits.entries()) {
        const migratedVisit: Record<string, unknown> = {
          ...visit,
          eventId,
          priority: index + 1,
        };
        delete migratedVisit.legacyPriority;
        await visitTable.put(migratedVisit);
        visitById.set(String(migratedVisit.id), migratedVisit);
        const circleKey = `${eventId}:${visit.circleId}`;
        if (!visitByCircle.has(circleKey)) {
          visitByCircle.set(circleKey, migratedVisit);
        }
      }
    }

    for (const circle of circles) {
      const { eventId: _eventId, priority: _priority, ...circleData } = circle;
      await circleTable.put(circleData);
    }

    const wishlistItems = await wishlistTable.toArray();
    for (const item of wishlistItems) {
      const circle = circleById.get(item.circleId);
      if (!circle) {
        throw new Error(
          `Cannot migrate wishlist item ${item.id}: circle ${item.circleId} was not found.`,
        );
      }
      const visit = visitByCircle.get(`${circle.eventId}:${circle.id}`);
      if (!visit) {
        throw new Error(
          `Cannot migrate wishlist item ${item.id}: no event visit was created.`,
        );
      }
      const { circleId: _circleId, ...itemData } = item;
      await wishlistTable.put({
        ...itemData,
        circleVisitId: visit.id,
      });
    }

    const syncQueueItems = await syncQueueTable.toArray();
    for (const item of syncQueueItems) {
      const payload = item.payload;
      if (!payload || typeof payload !== "object") {
        continue;
      }

      const record = payload as Record<string, unknown>;
      if (item.entity === "circles") {
        delete record.eventId;
        delete record.priority;
      } else if (item.entity === "circle_visits") {
        const migratedVisit = visitById.get(String(record.id));
        if (!migratedVisit) {
          throw new Error(
            `Cannot migrate sync item ${item.id}: circle visit ${String(record.id)} was not found.`,
          );
        }
        record.eventId = migratedVisit.eventId;
        record.priority = migratedVisit.priority;
      } else if (item.entity === "wishlist_items") {
        const circle = circleById.get(String(record.circleId));
        if (!circle) {
          throw new Error(
            `Cannot migrate sync item ${item.id}: circle ${String(record.circleId)} was not found.`,
          );
        }
        const visit = visitByCircle.get(`${circle.eventId}:${circle.id}`);
        if (!visit) {
          throw new Error(
            `Cannot migrate sync item ${item.id}: no event visit was created.`,
          );
        }
        delete record.circleId;
        record.circleVisitId = visit.id;
      }
      await syncQueueTable.update(item.id, { payload });
    }
  });

db.version(4)
  .stores({
    users: "id, email, name, createdAt",
    events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
    circles: "id, circleName, penName, genre, createdAt, updatedAt",
    circle_visits:
      "id, eventId, circleId, priority, &[eventId+priority], space, visitedAt, status",
    wishlist_items:
      "id, circleVisitId, title, type, purchased, purchasedAt, createdAt, updatedAt",
    sync_queue:
      "id, clientId, entity, entityId, operation, createdAt, syncedAt",
  })
  .upgrade(async (transaction) => {
    const circleTable = transaction.table("circles");
    const visitTable = transaction.table("circle_visits");
    const syncQueueTable = transaction.table("sync_queue");
    const circles = await circleTable.toArray();
    const circleById = new Map(circles.map((circle) => [circle.id, circle]));
    const visits = await visitTable.toArray();
    const visitById = new Map<string, Record<string, unknown>>();

    for (const visit of visits) {
      const circle = circleById.get(visit.circleId);
      if (!circle) {
        throw new Error(
          `Cannot migrate circle visit ${visit.id}: circle ${visit.circleId} was not found.`,
        );
      }

      const migratedVisit = {
        ...visit,
        space: typeof circle.space === "string" ? circle.space : "",
      };
      await visitTable.put(migratedVisit);
      visitById.set(String(migratedVisit.id), migratedVisit);
    }

    for (const circle of circles) {
      const { space: _space, ...circleData } = circle;
      await circleTable.put(circleData);
    }

    const syncQueueItems = await syncQueueTable.toArray();
    for (const item of syncQueueItems) {
      const payload = item.payload;
      if (!payload || typeof payload !== "object") {
        continue;
      }

      const record = payload as Record<string, unknown>;
      if (item.entity === "circles") {
        delete record.space;
      } else if (item.entity === "circle_visits") {
        const visit = visitById.get(String(record.id));
        if (!visit) {
          throw new Error(
            `Cannot migrate sync item ${item.id}: circle visit ${String(record.id)} was not found.`,
          );
        }
        record.space = visit.space;
      }
      await syncQueueTable.update(item.id, { payload });
    }
  });

db.version(5)
  .stores({
    users: "id, email, name, createdAt",
    events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
    circles: "id, circleName, penName, genre, createdAt, updatedAt",
    circle_visits:
      "id, eventId, circleId, priority, &[eventId+priority], space, visitedAt, status",
    wishlist_items:
      "id, circleId, circleVisitId, title, type, purchased, purchasedAt, createdAt, updatedAt",
    sync_queue:
      "id, clientId, entity, entityId, operation, createdAt, syncedAt",
  })
  .upgrade(async (transaction) => {
    const visitTable = transaction.table("circle_visits");
    const wishlistTable = transaction.table("wishlist_items");
    const syncQueueTable = transaction.table("sync_queue");
    const visits = await visitTable.toArray();
    const circleIdByVisitId = new Map(
      visits.map((visit) => [visit.id, visit.circleId]),
    );
    const items = await wishlistTable.toArray();

    for (const item of items) {
      const circleId = circleIdByVisitId.get(item.circleVisitId);
      if (!circleId) {
        throw new Error(
          `Cannot migrate wishlist item ${item.id}: circle visit ${item.circleVisitId} was not found.`,
        );
      }
      await wishlistTable.update(item.id, { circleId });
    }

    const syncQueueItems = await syncQueueTable
      .where("entity")
      .equals("wishlist_items")
      .toArray();
    for (const queueItem of syncQueueItems) {
      const payload = queueItem.payload;
      if (!payload || typeof payload !== "object") {
        throw new Error(
          `Cannot migrate sync item ${queueItem.id}: wishlist item payload is invalid.`,
        );
      }
      const record = payload as Record<string, unknown>;
      const circleId = circleIdByVisitId.get(String(record.circleVisitId));
      if (!circleId) {
        throw new Error(
          `Cannot migrate sync item ${queueItem.id}: circle visit ${String(record.circleVisitId)} was not found.`,
        );
      }
      record.circleId = circleId;
      await syncQueueTable.update(queueItem.id, { payload });
    }
  });

db.version(6)
  .stores({
    users: "id, email, name, createdAt",
    events: "id, userId, name, eventDate, venue, createdAt, updatedAt",
    circles: "id, circleName, penName, genre, createdAt, updatedAt",
    circle_visits:
      "id, eventId, circleId, priority, &[eventId+priority], space, visitedAt, status",
    wishlist_items:
      "id, circleId, circleVisitId, title, type, purchased, purchasedAt, createdAt, updatedAt",
    sync_queue:
      "id, clientId, entity, entityId, operation, createdAt, syncedAt",
  })
  .upgrade(async (transaction) => {
    const circleTable = transaction.table("circles");
    const circles = await circleTable.toArray();

    for (const circle of circles) {
      const legacyCircle = circle as Circle & {
        mapUrl?: string | null;
      };
      if ("mapUrl" in legacyCircle || !("circleURL" in legacyCircle)) {
        const { mapUrl, ...circleData } = legacyCircle;
        await circleTable.put({
          ...circleData,
          circleURL: legacyCircle.circleURL ?? mapUrl ?? null,
        });
      }
    }

    const syncQueueTable = transaction.table("sync_queue");
    const circleSyncItems = await syncQueueTable
      .where("entity")
      .equals("circles")
      .toArray();
    for (const item of circleSyncItems) {
      const payload = item.payload;
      if (!payload || typeof payload !== "object") {
        continue;
      }

      const record = payload as Record<string, unknown>;
      if ("mapUrl" in record || !("circleURL" in record)) {
        record.circleURL = record.circleURL ?? record.mapUrl ?? null;
        delete record.mapUrl;
        await syncQueueTable.update(item.id, { payload });
      }
    }
  });
