import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import ItemPurchaseActions from "@/features/item/ItemPurchaseActions";
import ItemResultSummary from "@/features/item/ItemResultSummary";

export type CircleResultSummaryProps = {
  circle: CircleCardProps;
  disabled: boolean;
  onStatusChange: (
    itemId: string,
    status: WishlistItemStatus,
  ) => Promise<void>;
};

export default function CircleResultSummary({
  circle,
  disabled,
  onStatusChange,
}: CircleResultSummaryProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Stack gap={1}>
          <Text fontSize="lg" fontWeight="bold">
            {circle.space}
          </Text>
          <Heading size="xl">{circle.name || "サークル名未設定"}</Heading>
          {circle.penName && <Text>{circle.penName}</Text>}
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack gap={3}>
          {circle.books.map((book) => (
            <ItemResultSummary
              key={book.id}
              item={book}
              actions={
                <ItemPurchaseActions
                  itemId={book.id}
                  status={book.status}
                  mode="result"
                  disabled={disabled}
                  onStatusChange={onStatusChange}
                />
              }
            />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
