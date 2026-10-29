import {
  db,
  type SyncQueueItem,
  type WishlistItem,
} from "@/db/database";

export type NewWishlistItem = {
  title: string;
  price: number;
};

export function useAddWishlistItem() {
  return async (circleVisitId: string, newItem: NewWishlistItem) => {
    const now = new Date().toISOString();
    const itemId = crypto.randomUUID();

    await db.transaction(
      "rw",
      [db.circle_visits, db.wishlist_items, db.sync_queue],
      async () => {
        const circleVisit = await db.circle_visits.get(circleVisitId);
        if (!circleVisit) {
          throw new Error("巡回リストが見つかりません。");
        }
        const item: WishlistItem = {
          id: itemId,
          circleId: circleVisit.circleId,
          circleVisitId,
          title: newItem.title.trim(),
          type: null,
          price: newItem.price,
          quantity: 1,
          purchased: false,
          soldOut: false,
          purchasedAt: null,
          memo: null,
          createdAt: now,
          updatedAt: now,
        };
        const syncQueueItem: SyncQueueItem = {
          id: crypto.randomUUID(),
          clientId: "local-client",
          entity: "wishlist_items",
          entityId: item.id,
          operation: "create",
          payload: item,
          createdAt: now,
          syncedAt: null,
        };
        await db.wishlist_items.add(item);
        await db.sync_queue.add(syncQueueItem);
      },
    );

    return itemId;
  };
}
