import { Card, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { WishlistItemStatus } from "@/db/database";
import { semanticColors } from "@/theme/semanticColors";

const statusLabels: Record<WishlistItemStatus, string> = {
  not_acquired: "未入手",
  venue_acquired: "会場入手済",
  venue_unacquired: "会場未入手",
  online_purchased: "通販購入済",
  given_up: "諦める",
};

export type ItemCardBodyProps = {
  status: WishlistItemStatus;
  eventName?: string;
  children?: ReactNode;
};

export default function ItemCardBody({
  status,
  eventName,
  children,
}: ItemCardBodyProps) {
  const isPositive = status === "venue_acquired" || status === "online_purchased";
  const isNegative = status === "venue_unacquired" || status === "given_up";

  return (
    <Card.Body paddingTop={0}>
      <Stack gap={2}>
        <Text
          color={
            isPositive
              ? semanticColors.positive.text
              : isNegative
                ? semanticColors.negative.text
                : undefined
          }
        >
          状態: {statusLabels[status]}
        </Text>
        {eventName && <Text>頒布イベント: {eventName}</Text>}
        {children}
      </Stack>
    </Card.Body>
  );
}
