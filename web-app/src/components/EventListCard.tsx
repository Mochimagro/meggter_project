import { Card, Heading, Text } from "@chakra-ui/react";
import type { EventListCardProps } from "../entities/CardEntities";

export default function EventListCard({ title, date }: EventListCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{date}</Text>
      </Card.Header>
    </Card.Root>
  );
}
