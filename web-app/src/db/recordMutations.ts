import {
  db,
  type Circle,
  type CircleVisit,
  type Event,
  type SyncEntity,
  type SyncQueueItem,
  type WishlistItem,
} from "@/db/database";

function createSyncQueueItem(
  entity: SyncEntity,
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
    createdAt: new Date().toISOString(),
    syncedAt: null,
  };
}

export async function updateEvent(
  eventId: string,
  changes: Pick<Event, "name" | "eventDate" | "venue">,
) {
  await db.transaction("rw", [db.events, db.sync_queue], async () => {
    const event = await db.events.get(eventId);
    if (!event) {
      throw new Error("イベントが見つかりません。");
    }

    const updatedEvent: Event = {
      ...event,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await db.events.put(updatedEvent);
    await db.sync_queue.add(
      createSyncQueueItem("events", eventId, "update", updatedEvent),
    );
  });
}

export async function deleteEvent(eventId: string) {
  await db.transaction(
    "rw",
    [db.events, db.circle_visits, db.wishlist_items, db.sync_queue],
    async () => {
      const event = await db.events.get(eventId);
      if (!event) {
        throw new Error("イベントが見つかりません。");
      }

      const visits = await db.circle_visits
        .where("eventId")
        .equals(eventId)
        .toArray();
      const items = visits.length
        ? await db.wishlist_items
            .where("circleVisitId")
            .anyOf(visits.map((visit) => visit.id))
            .toArray()
        : [];
      const queueItems = [
        ...items.map((item) =>
          createSyncQueueItem("wishlist_items", item.id, "delete", item),
        ),
        ...visits.map((visit) =>
          createSyncQueueItem("circle_visits", visit.id, "delete", visit),
        ),
        createSyncQueueItem("events", event.id, "delete", event),
      ];

      await db.wishlist_items.bulkDelete(items.map((item) => item.id));
      await db.circle_visits.bulkDelete(visits.map((visit) => visit.id));
      await db.events.delete(event.id);
      await db.sync_queue.bulkAdd(queueItems);
    },
  );
}

export async function updateEventCircle(
  circleId: string,
  circleVisitId: string,
  changes: {
    circleName: string;
    penName: string | null;
    circleURL: string | null;
    space: string;
  },
) {
  await db.transaction(
    "rw",
    [db.circles, db.circle_visits, db.sync_queue],
    async () => {
      const circle = await db.circles.get(circleId);
      const visit = await db.circle_visits.get(circleVisitId);
      if (!circle || !visit || visit.circleId !== circleId) {
        throw new Error("サークル情報が見つかりません。");
      }

      const updatedCircle: Circle = {
        ...circle,
        circleName: changes.circleName,
        penName: changes.penName,
        circleURL: changes.circleURL,
        updatedAt: new Date().toISOString(),
      };
      const updatedVisit: CircleVisit = {
        ...visit,
        space: changes.space,
      };
      await db.circles.put(updatedCircle);
      await db.circle_visits.put(updatedVisit);
      await db.sync_queue.bulkAdd([
        createSyncQueueItem("circles", circleId, "update", updatedCircle),
        createSyncQueueItem(
          "circle_visits",
          circleVisitId,
          "update",
          updatedVisit,
        ),
      ]);
    },
  );
}

export async function deleteEventCircle(circleVisitId: string) {
  await db.transaction(
    "rw",
    [db.circle_visits, db.wishlist_items, db.sync_queue],
    async () => {
      const visit = await db.circle_visits.get(circleVisitId);
      if (!visit) {
        throw new Error("イベント内のサークル情報が見つかりません。");
      }

      const items = await db.wishlist_items
        .where("circleVisitId")
        .equals(circleVisitId)
        .toArray();
      await db.wishlist_items.bulkDelete(items.map((item) => item.id));
      await db.circle_visits.delete(circleVisitId);
      await db.sync_queue.bulkAdd([
        ...items.map((item) =>
          createSyncQueueItem("wishlist_items", item.id, "delete", item),
        ),
        createSyncQueueItem("circle_visits", visit.id, "delete", visit),
      ]);
    },
  );
}

export async function updateWishlistItem(
  itemId: string,
  changes: Pick<WishlistItem, "title" | "price">,
) {
  await db.transaction("rw", [db.wishlist_items, db.sync_queue], async () => {
    const item = await db.wishlist_items.get(itemId);
    if (!item) {
      throw new Error("購入予定アイテムが見つかりません。");
    }

    const updatedItem: WishlistItem = {
      ...item,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await db.wishlist_items.put(updatedItem);
    await db.sync_queue.add(
      createSyncQueueItem("wishlist_items", itemId, "update", updatedItem),
    );
  });
}

export async function setWishlistItemOutcome(
  itemId: string,
  outcome: "purchased" | "soldOut",
) {
  await db.transaction("rw", [db.wishlist_items, db.sync_queue], async () => {
    const item = await db.wishlist_items.get(itemId);
    if (!item) {
      throw new Error("購入予定アイテムが見つかりません。");
    }

    const now = new Date().toISOString();
    const updatedItem: WishlistItem = {
      ...item,
      purchased: outcome === "purchased",
      soldOut: outcome === "soldOut",
      purchasedAt: outcome === "purchased" ? now : null,
      updatedAt: now,
    };
    await db.wishlist_items.put(updatedItem);
    await db.sync_queue.add(
      createSyncQueueItem("wishlist_items", itemId, "update", updatedItem),
    );
  });
}

export async function markCircleVisited(circleVisitId: string) {
  await db.transaction(
    "rw",
    [db.circle_visits, db.wishlist_items, db.sync_queue],
    async () => {
      const visit = await db.circle_visits.get(circleVisitId);
      if (!visit) {
        throw new Error("イベント内のサークル情報が見つかりません。");
      }

      const now = new Date().toISOString();
      const visits = await db.circle_visits
        .where("eventId")
        .equals(visit.eventId)
        .sortBy("priority");
      const reorderedVisits = [
        ...visits.filter((entry) => entry.id !== circleVisitId),
        visit,
      ];
      await setVisitPriorities(reorderedVisits);
      const updatedVisits = reorderedVisits.map(
        (entry, index): CircleVisit => ({
          ...entry,
          priority: index + 1,
          ...(entry.id === circleVisitId
            ? { status: "visited" as const, visitedAt: now }
            : {}),
        }),
      );
      const items = await db.wishlist_items
        .where("circleVisitId")
        .equals(circleVisitId)
        .toArray();
      const updatedItems = items.map((item): WishlistItem => ({
        ...item,
        purchased: true,
        soldOut: false,
        purchasedAt: now,
        updatedAt: now,
      }));

      await db.circle_visits.bulkPut(updatedVisits);
      await db.wishlist_items.bulkPut(updatedItems);
      await db.sync_queue.bulkAdd([
        ...updatedVisits.map((entry) =>
          createSyncQueueItem("circle_visits", entry.id, "update", entry),
        ),
        ...updatedItems.map((item) =>
          createSyncQueueItem("wishlist_items", item.id, "update", item),
        ),
      ]);
    },
  );
}

export async function undoCircleVisit(circleVisitId: string) {
  await db.transaction("rw", [db.circle_visits, db.sync_queue], async () => {
    const visit = await db.circle_visits.get(circleVisitId);
    if (!visit) {
      throw new Error("イベント内のサークル情報が見つかりません。");
    }

    const visits = await db.circle_visits
      .where("eventId")
      .equals(visit.eventId)
      .sortBy("priority");
    const reorderedVisits = [
      visit,
      ...visits.filter((entry) => entry.id !== circleVisitId),
    ];
    await setVisitPriorities(reorderedVisits);
    const updatedVisits = reorderedVisits.map(
      (entry, index): CircleVisit => ({
        ...entry,
        priority: index + 1,
        ...(entry.id === circleVisitId
          ? { status: "want_to_visit" as const, visitedAt: null }
          : {}),
      }),
    );

    await db.circle_visits.bulkPut(updatedVisits);
    await db.sync_queue.bulkAdd(
      updatedVisits.map((entry) =>
        createSyncQueueItem("circle_visits", entry.id, "update", entry),
      ),
    );
  });
}

async function setVisitPriorities(visits: CircleVisit[]) {
  for (const [index, visit] of visits.entries()) {
    await db.circle_visits.update(visit.id, { priority: -(index + 1) });
  }
}

export async function deferCircleVisit(circleVisitId: string) {
  await db.transaction("rw", [db.circle_visits, db.sync_queue], async () => {
    const visit = await db.circle_visits.get(circleVisitId);
    if (!visit) {
      throw new Error("イベント内のサークル情報が見つかりません。");
    }
    if (visit.status === "visited") {
      return;
    }

    const visits = await db.circle_visits
      .where("eventId")
      .equals(visit.eventId)
      .sortBy("priority");
    const reorderedVisits = [
      ...visits.filter((entry) => entry.id !== circleVisitId),
      visit,
    ];
    await setVisitPriorities(reorderedVisits);

    const updatedVisits = reorderedVisits.map((entry, index): CircleVisit => ({
      ...entry,
      priority: index + 1,
      ...(entry.id === circleVisitId ? { status: "skipped" as const } : {}),
    }));
    await db.circle_visits.bulkPut(updatedVisits);
    await db.sync_queue.bulkAdd(
      updatedVisits.map((entry) =>
        createSyncQueueItem("circle_visits", entry.id, "update", entry),
      ),
    );
  });
}

export async function deleteWishlistItem(itemId: string) {
  await db.transaction("rw", [db.wishlist_items, db.sync_queue], async () => {
    const item = await db.wishlist_items.get(itemId);
    if (!item) {
      throw new Error("購入予定アイテムが見つかりません。");
    }

    await db.wishlist_items.delete(itemId);
    await db.sync_queue.add(
      createSyncQueueItem("wishlist_items", itemId, "delete", item),
    );
  });
}

export async function updateCircle(
  circleId: string,
  changes: Pick<
    Circle,
    "circleName" | "penName" | "circleURL" | "genre" | "memo"
  >,
) {
  await db.transaction("rw", [db.circles, db.sync_queue], async () => {
    const circle = await db.circles.get(circleId);
    if (!circle) {
      throw new Error("サークルが見つかりません。");
    }

    const updatedCircle: Circle = {
      ...circle,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await db.circles.put(updatedCircle);
    await db.sync_queue.add(
      createSyncQueueItem("circles", circleId, "update", updatedCircle),
    );
  });
}

export async function deleteCircle(circleId: string) {
  await db.transaction(
    "rw",
    [db.circles, db.circle_visits, db.wishlist_items, db.sync_queue],
    async () => {
      const circle = await db.circles.get(circleId);
      if (!circle) {
        throw new Error("サークルが見つかりません。");
      }

      const visits = await db.circle_visits
        .where("circleId")
        .equals(circleId)
        .toArray();
      const items = visits.length
        ? await db.wishlist_items
            .where("circleVisitId")
            .anyOf(visits.map((visit) => visit.id))
            .toArray()
        : [];
      const queueItems = [
        ...items.map((item) =>
          createSyncQueueItem("wishlist_items", item.id, "delete", item),
        ),
        ...visits.map((visit) =>
          createSyncQueueItem("circle_visits", visit.id, "delete", visit),
        ),
        createSyncQueueItem("circles", circle.id, "delete", circle),
      ];

      await db.wishlist_items.bulkDelete(items.map((item) => item.id));
      await db.circle_visits.bulkDelete(visits.map((visit) => visit.id));
      await db.circles.delete(circle.id);
      await db.sync_queue.bulkAdd(queueItems);
    },
  );
}
