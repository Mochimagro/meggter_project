import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import { semanticColors } from "@/theme/semanticColors";

type EventResultCheckedItemListProps = {
  circles: CircleCardProps[];
};

const statusLabels: Record<WishlistItemStatus, string> = {
  not_acquired: "未入手",
  venue_acquired: "会場入手済",
  venue_unacquired: "会場未入手",
  online_purchased: "通販購入済",
  given_up: "諦める",
};

export default function EventResultCheckedItemList({
  circles,
}: EventResultCheckedItemListProps) {
  const checkedCircles = circles
    .map((circle) => ({
      ...circle,
      books: circle.books.filter((book) => book.status !== "venue_unacquired"),
    }))
    .filter((circle) => circle.books.length > 0);

  return (
    <Stack gap={3}>
      <Heading size="lg">戦利品リスト</Heading>
      {checkedCircles.length === 0 ? null : (
        <Box as="ul" listStyleType="none" margin={0} padding={0}>
          {checkedCircles.map((circle) => (
            <Box as="li" key={circle.circleVisitId} marginBottom={3}>
              <Text fontWeight="bold">{circle.name || "サークル名未設定"}</Text>
              <Box as="ul" paddingLeft={6}>
                {circle.books.map((book) => (
                  <Box as="li" key={book.id}>
                    <Text>
                      {book.title} —{" "}
                      <Text
                        as="span"
                        color={
                          book.status === "venue_acquired" ||
                          book.status === "online_purchased"
                            ? semanticColors.positive.text
                            : book.status === "venue_unacquired" ||
                                book.status === "given_up"
                              ? semanticColors.negative.text
                              : undefined
                        }
                      >
                        {statusLabels[book.status]}
                      </Text>
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}
