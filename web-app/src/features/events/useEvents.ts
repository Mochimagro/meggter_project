import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/database";

export function useEvents(excludePastEvents = false) {
  return useLiveQuery(
    async () => {
      const events = await db.events.orderBy("eventDate").reverse().toArray();

      if (!excludePastEvents) {
        return events;
      }

      const today = new Date();
      const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      return events.filter((event) => event.eventDate >= todayString);
    },
    [excludePastEvents],
  );
}
