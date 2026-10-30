import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import InteractiveItemCard from "../features/item/InteractiveItemCard";

type EventResultCircleCardProps = CircleCardProps & {
  disabled: boolean;
  onStatusChange: (itemId: string, status: WishlistItemStatus) => Promise<void>;
};

export default function EventResultCircleCard({
  name,
  penName,
  space,
  books,
  disabled,
  onStatusChange,
}: EventResultCircleCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Stack gap={1}>
          <Text fontSize="lg" fontWeight="bold">
            {space}
          </Text>
          <Heading size="xl">{name || "サークル名未設定"}</Heading>
          {penName && <Text>{penName}</Text>}
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack gap={3}>
          {books.map((book) => (
            <InteractiveItemCard
              key={book.id}
              {...book}
              resultActions
              disabled={disabled}
              onStatusChange={onStatusChange}
            />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
