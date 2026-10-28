export type EventListProps = { events: EventInfoCardProps[] };

export type EventListCardProps = Pick<
  EventInfoCardProps,
  "title" | "date" | "venue"
> & {
  id: string;
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
};
