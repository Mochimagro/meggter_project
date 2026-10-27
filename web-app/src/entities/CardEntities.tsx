export type EventListProps = { events: EventInfoCardProps[] };

export type EventListCardProps = Pick<EventInfoCardProps, "title" | "date">;

export type EventInfoCardProps = {
  title: string;
  date: string;
  circles: CircleCardProps[];
};

export type CircleCardProps = {
  name: string;
  penName: string;
  space: string;
  totalPrice: number;
  books: BookCardProps[];
};

export type BookCardProps = {
  title: string;
  price: number;
};
