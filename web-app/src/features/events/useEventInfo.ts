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

    const circles = await db.circles.where("eventId").equals(eventId).toArray();
    const wishlistItems = circles.length
      ? await db.wishlist_items
          .where("circleId")
          .anyOf(circles.map((circle) => circle.id))
          .toArray()
      : [];

    const eventInfo: EventInfoCardProps = {
      title: event.name,
      date: event.eventDate,
      circles: circles.map((circle) => {
        const books = wishlistItems.filter((item) => item.circleId === circle.id);
        const pricedBooks = books.filter((book) => book.price !== null);

        return {
          name: circle.circleName,
          penName: circle.penName ?? "",
          space: circle.space ?? "",
          totalPrice:
            pricedBooks.length > 0
              ? pricedBooks.reduce(
                  (total, book) =>
                    total + (book.price ?? 0) * book.quantity,
                  0,
                )
              : null,
          books: books.map((book) => ({
            title: book.title,
            price: book.price,
          })),
        };
      }),
    };

    return eventInfo;
  }, [eventId]);
}
