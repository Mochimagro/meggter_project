import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { CircleCardInfoProps } from "../entities/CardEntities";
import BookCard from "./BookCard";

export default function CircleCard({
  name,
  penName,
  space,
  totalPrice,
  books,
}: CircleCardInfoProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{name}</Heading>
        <Text>{penName}</Text>
        <Text>スペース: {space}</Text>
        <Text>合計: {totalPrice}円</Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {books.map((book, index) => (
            <BookCard key={`${book.title}-${index}`} {...book} />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
