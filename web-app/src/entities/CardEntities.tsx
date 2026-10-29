import type { EventStatus, WishlistItemStatus } from "@/db/database";

export type EventListProps = { events: EventInfoCardProps[] };

export type EventListCardProps = Pick<
  EventInfoCardProps,
  "title" | "date" | "venue"
> & {
  id: string;
  status: EventStatus;
};

export type EventInfoCardProps = {
  title: string;
  date: string;
  venue?: string | null;
  entranceFee?: number | null;
  transportationExpenses?: number | null;
  circles: CircleCardProps[];
};

export type CircleCardProps = {
  id: string;
  circleVisitId: string;
  priority: number;
  visited: boolean;
  name: string;
  penName: string;
  circleURL?: string | null;
  space: string;
  totalPrice: number | null;
  books: BookCardProps[];
  isEntering?: boolean;
  onAnimationEnd?: () => void;
};

export type BookCardProps = {
  id: string;
  title: string;
  price: number | null;
  status: WishlistItemStatus;
};
