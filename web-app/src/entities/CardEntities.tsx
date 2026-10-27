export type EventCardInfoProps = {
  title: string;
  date: string;
  circles: CircleCardInfoProps[];
};

export type CircleCardInfoProps = {
  name: string;
  penName: string;
  space: string;
  totalPrice: number;
  books: BookCardInfoProps[];
};

export type BookCardInfoProps = {
  title: string;
  price: number;
};
