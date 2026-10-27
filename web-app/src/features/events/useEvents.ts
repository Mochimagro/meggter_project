import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/database";

export function useEvents() {
  return useLiveQuery(
    () => db.events.orderBy(`eventDate`).reverse().toArray(),
    [],
  );
}
