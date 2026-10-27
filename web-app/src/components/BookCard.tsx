import { Card, Heading, Text } from "@chakra-ui/react";
import type { BookCardInfoProps } from "../entities/CardEntities";

export default function BookCard({ title, price }: BookCardInfoProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{price}円</Text>
      </Card.Header>
    </Card.Root>
  );
}
