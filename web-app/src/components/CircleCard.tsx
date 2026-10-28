import { Button, Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { CircleCardProps } from "../entities/CardEntities";
import BookCard from "./BookCard";

export default function CircleCard({
  name,
  penName,
  space,
  totalPrice,
  books,
  isEntering = false,
  onAnimationEnd,
}: CircleCardProps) {
  return (
    <Card.Root
      className={isEntering ? "circle-card-enter" : undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <Card.Header>
        <Heading size="md">{name || "サークル名未設定"}</Heading>
        <Text>{penName}</Text>
        <Text>スペース: {space}</Text>
        <Text>
          合計: {totalPrice === null ? "価格未設定" : `${totalPrice}円`}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {books.map((book, index) => (
            <BookCard key={`${book.title}-${index}`} {...book} />
          ))}
        </Stack>
      </Card.Body>
      <Button>買うもの追加</Button>
    </Card.Root>
  );
}
