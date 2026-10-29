import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/database";
import type { EventInfoCardProps } from "../../entities/CardEntities";

export function useEventInfo(eventId: string | undefined) {
  return useLiveQuery(async () => {
    if (!eventId) {
      return null;
    }

    const event = await db.events.get(eventId);
    if (!event) {
      return null;
    }

    const visits = await db.circle_visits
      .where("eventId")
      .equals(eventId)
      .sortBy("priority");
    const circleIds = [...new Set(visits.map((visit) => visit.circleId))];
    const circles = circleIds.length
      ? await db.circles.where("id").anyOf(circleIds).toArray()
      : [];
    const wishlistItems = visits.length
      ? await db.wishlist_items
          .where("circleVisitId")
          .anyOf(visits.map((visit) => visit.id))
          .toArray()
      : [];
    const circlesById = new Map(circles.map((circle) => [circle.id, circle]));

    const eventInfo: EventInfoCardProps = {
      title: event.name,
      date: event.eventDate,
      venue: event.venue,
      entranceFee: event.entranceFee,
      transportationExpenses: event.transportationExpenses,
      circles: visits.flatMap((visit) => {
        const circle = circlesById.get(visit.circleId);
        if (!circle) {
          return [];
        }
        const books = wishlistItems.filter(
          (item) => item.circleVisitId === visit.id,
        );
        const pricedBooks = books.filter((book) => book.price !== null);

        return [{
          id: circle.id,
          circleVisitId: visit.id,
          priority: visit.priority,
          visited: visit.status === "visited",
          name: circle.circleName,
          penName: circle.penName ?? "",
          circleURL: circle.circleURL,
          space: visit.space,
          totalPrice:
            pricedBooks.length > 0
              ? pricedBooks.reduce(
                  (total, book) =>
                    total + (book.price ?? 0) * book.quantity,
                  0,
                )
              : null,
          books: books.map((book) => ({
            id: book.id,
            title: book.title,
            price: book.price,
            status: book.status,
          })),
        }];
      }),
    };

    return eventInfo;
  }, [eventId]);
}
