import Dexie, { type EntityTable } from "dexie";

export interface EventRecord {
  id: string;
  name: string;
  eventDate: string;
  venue?: string;
  updatedAt: string;
}

export const db = new Dexie(`meggter`) as Dexie & {
  events: EntityTable<EventRecord, `id`>;
};
db.version(1).stores({
  events: `id, eventDate, name`,
});

export async function seedEventsIfEmpty() {
  const count = await db.events.count();
  if (count > 0) return;

  await db.events.bulkAdd([
    {
      id: crypto.randomUUID(),
      name: "例大祭",
      eventDate: `2026-11-01`,
      venue: `インテックス大阪`,
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "コミケ",
      eventDate: `2026-12-30`,
      venue: `東京ビッグサイト`,
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "当日",
      eventDate: `2026-10-28`,
      venue: `インテックス大阪`,
      updatedAt: new Date().toISOString(),
    },
  ]);
}
