import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { EventCardInfoProps } from "../entities/CardEntities";
import CircleCard from "./CircleCard";

export default function EventCard({ title, date, circles }: EventCardInfoProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{date}</Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {circles.map((circle, index) => (
            <CircleCard key={`${circle.name}-${index}`} {...circle} />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
