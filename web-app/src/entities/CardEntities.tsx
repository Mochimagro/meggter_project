export type EventListProps = { events: EventInfoCardProps[] };

export type EventListCardProps = Pick<EventInfoCardProps, "title" | "date"> & {
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
  name: string;
  penName: string;
  space: string;
  totalPrice: number | null;
  books: BookCardProps[];
};

export type BookCardProps = {
  title: string;
  price: number | null;
};
