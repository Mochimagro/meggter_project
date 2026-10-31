// イベントの開催結果を集計して表示する。
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import CircleResultSummary from "@/features/circle/CircleResultSummary";
import ItemResultSummary from "@/features/item/ItemResultSummary";

export type EventResultSummaryProps = {
  circles: CircleCardProps[];
  disabled: boolean;
  onStatusChange: (
    itemId: string,
    status: WishlistItemStatus,
  ) => Promise<void>;
  error?: string;
};

export default function EventResultSummary({
  circles,
  disabled,
  onStatusChange,
  error,
}: EventResultSummaryProps) {
  const resultCircles = circles
    .map((circle) => ({
      ...circle,
      books: circle.books.filter((book) => book.status === "venue_unacquired"),
    }))
    .filter((circle) => circle.books.length > 0);
  const missedItemsCount = resultCircles.reduce(
    (count, circle) => count + circle.books.length,
    0,
  );
  return (
    <Stack gap={5}>
      <Text fontSize="xl" fontWeight="bold">
        買い逃したアイテム: {missedItemsCount}
      </Text>
      {error && (
        <Text role="alert" color="red.600">
          {error}
        </Text>
      )}
      {resultCircles.map((circle) => (
        <CircleResultSummary
          key={circle.circleVisitId}
          circle={circle}
          disabled={disabled}
          onStatusChange={onStatusChange}
        />
      ))}
      {resultCircles.length === 0 && <Text>未チェック無し。</Text>}
      <Stack gap={3}>
        <Heading size="lg">戦利品リスト</Heading>
        {circles.map((circle) => {
          const checkedItems = circle.books.filter(
            (book) => book.status !== "venue_unacquired",
          );
          if (checkedItems.length === 0) {
            return null;
          }

          return (
            <Box key={circle.circleVisitId} as="section">
              <Text fontWeight="bold">
                {circle.name || "サークル名未設定"}
              </Text>
              <Box as="ul" paddingLeft={6}>
                {checkedItems.map((book) => (
                  <ItemResultSummary
                    key={book.id}
                    item={book}
                    variant="compact"
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
