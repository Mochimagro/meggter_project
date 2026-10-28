import { db } from "./database";
import type {
  Circle,
  CircleVisit,
  Event,
  SyncQueueItem,
  WishlistItem,
} from "./database";

const now = () => new Date().toISOString();

function createSyncQueueItem(
  entity: SyncQueueItem["entity"],
  entityId: string,
  operation: SyncQueueItem["operation"],
  payload: unknown,
): SyncQueueItem {
  return {
    id: crypto.randomUUID(),
    clientId: "local-client",
    entity,
    entityId,
    operation,
    payload,
    createdAt: now(),
    syncedAt: null,
  };
}

export async function seedEventsIfEmpty() {
  const eventCount = await db.events.count();

  if (eventCount > 0) {
    return;
  }

  const eventId = crypto.randomUUID();
  const circleId1 = crypto.randomUUID();
  const circleId2 = crypto.randomUUID();
  const wishlistItemId1 = crypto.randomUUID();
  const wishlistItemId2 = crypto.randomUUID();
  const wishlistItemId3 = crypto.randomUUID();
  const circleVisitId1 = crypto.randomUUID();
  const circleVisitId2 = crypto.randomUUID();

  const event: Event = {
    id: eventId,
    userId: null,
    name: "コミックマーケット105",
    eventDate: "2026-12-30",
    venue: "東京ビッグサイト",
    memo: "東館優先で巡回する",
    createdAt: now(),
    updatedAt: now(),
  };

  const circles: Circle[] = [
    {
      id: circleId1,
      circleName: "サークルA",
      penName: "作者A",
      genre: "オリジナル",
      space: "東メ-01",
      mapUrl: "https://example.com/map/east",
      memo: "新刊と既刊を確認する",
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: circleId2,
      circleName: "サークルB",
      penName: "作者B",
      genre: "ゲーム",
      space: "西れ-02",
      mapUrl: "https://example.com/map/west",
      memo: "グッズの在庫確認",
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const circleVisits: CircleVisit[] = [
    {
      id: circleVisitId1,
      eventId,
      circleId: circleId1,
      priority: 1,
      visitedAt: null,
      status: "want_to_visit",
      memo: "開場直後に向かう",
    },
    {
      id: circleVisitId2,
      eventId,
      circleId: circleId2,
      priority: 2,
      visitedAt: null,
      status: "want_to_visit",
      memo: null,
    },
  ];

  const wishlistItems: WishlistItem[] = [
    {
      id: wishlistItemId1,
      circleVisitId: circleVisitId1,
      title: "新刊",
      type: "同人誌",
      price: 1000,
      quantity: 1,
      purchased: false,
      purchasedAt: null,
      memo: "表紙違いも確認",
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: wishlistItemId2,
      circleVisitId: circleVisitId1,
      title: "アクリルキーホルダー",
      type: "グッズ",
      price: 800,
      quantity: 1,
      purchased: false,
      purchasedAt: null,
      memo: null,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: wishlistItemId3,
      circleVisitId: circleVisitId2,
      title: "ボクセル素材集",
      type: "デジタル",
      price: 1500,
      quantity: 1,
      purchased: false,
      purchasedAt: null,
      memo: "ライセンスを確認",
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const syncQueueItems: SyncQueueItem[] = [
    createSyncQueueItem("events", event.id, "create", event),
    ...circles.map((circle) =>
      createSyncQueueItem("circles", circle.id, "create", circle),
    ),
    ...circleVisits.map((visit) =>
      createSyncQueueItem("circle_visits", visit.id, "create", visit),
    ),
    ...wishlistItems.map((item) =>
      createSyncQueueItem("wishlist_items", item.id, "create", item),
    ),
  ];

  await db.transaction(
    "rw",
    [db.events, db.circles, db.circle_visits, db.wishlist_items, db.sync_queue],
    async () => {
      await db.events.bulkAdd([event]);
      await db.circles.bulkAdd(circles);
      await db.circle_visits.bulkAdd(circleVisits);
      await db.wishlist_items.bulkAdd(wishlistItems);
      await db.sync_queue.bulkAdd(syncQueueItems);
    },
  );
}
