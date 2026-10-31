// イベントで巡回するサークルと訪問状態を表示する。
import { Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import type { WishlistItemStatus } from "@/db/database";
import type { CircleCardProps } from "@/entities/CardEntities";
import { setWishlistItemStatus } from "@/db/recordMutations";
import CircleStatusBadge from "@/features/circle/CircleStatusBadge";
import CircleTourActions from "@/features/circle/CircleTourActions";
import InteractiveItemCard from "@/features/item/InteractiveItemCard";
import { semanticColors } from "@/theme/semanticColors";

export default function EventVisitCircle({
  circleVisitId,
  visited,
  name,
  penName,
  space,
  books,
}: CircleCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const updateItemStatus = async (
    itemId: string,
    status: WishlistItemStatus,
  ) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      await setWishlistItemStatus(itemId, status);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root
      position="relative"
      backgroundColor={visited ? semanticColors.positive.card : undefined}
    >
      <Card.Header opacity={visited ? 0.5 : 1}>
        <Stack gap={1} paddingTop={8}>
          <Text fontSize="lg" fontWeight="bold">
            {space}
          </Text>
          <Heading size="xl">{name || "サークル名未設定"}</Heading>
          {penName && <Text>{penName}</Text>}
        </Stack>
      </Card.Header>
      <CircleStatusBadge visited={visited} />
      <Card.Body opacity={visited ? 0.5 : 1}>
        <fieldset
          disabled={isSubmitting}
          style={{
            border: 0,
            margin: 0,
            minWidth: 0,
            padding: 0,
          }}
        >
          <Stack>
            {books.map((book) => (
              <InteractiveItemCard
                key={book.id}
                {...book}
                visitActions
                visited={visited}
                disabled={isSubmitting}
                onStatusChange={updateItemStatus}
              />
            ))}
          </Stack>
        </fieldset>
      </Card.Body>
      <Card.Footer justifyContent="flex-end" flexWrap="wrap">
        <Flex justify="flex-end" width="full">
          <CircleTourActions
            circleVisitId={circleVisitId}
            visited={visited}
            onPendingChange={setIsSubmitting}
          />
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
