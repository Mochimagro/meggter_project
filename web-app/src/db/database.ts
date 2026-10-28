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
  eventId: string;
  circleName: string;
  penName: string | null;
  genre: string | null;
  space: string | null;
  mapUrl: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CircleVisit {
  id: string;
  circleId: string;
  visitedAt: string | null;
  status: VisitStatus;
  memo: string | null;
}

export interface WishlistItem {
  id: string;
  circleId: string;
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
