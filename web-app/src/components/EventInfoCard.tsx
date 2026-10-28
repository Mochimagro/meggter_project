import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { EventInfoCardProps } from "../entities/CardEntities";
import CircleCard from "./CircleCard";

export default function EventInfoCard({
  title,
  date,
  venue,
  entranceFee,
  transportationExpenses,
  circles,
}: EventInfoCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Text>{date}</Text>
        {venue && <Text>会場・開催地：{venue}</Text>}
        {entranceFee != null && (
          <Text>参加費：{entranceFee.toLocaleString()}円</Text>
        )}
        {transportationExpenses != null && (
          <Text>
            交通費：{transportationExpenses.toLocaleString()}円
          </Text>
        )}
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
