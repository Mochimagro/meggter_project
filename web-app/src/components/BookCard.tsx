import { Card, Heading, Text } from "@chakra-ui/react";
import type { BookCardProps } from "../entities/CardEntities";

export default function BookCard({ title, price }: BookCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{price === null ? "価格未設定" : `${price}円`}</Text>
      </Card.Header>
    </Card.Root>
  );
}
