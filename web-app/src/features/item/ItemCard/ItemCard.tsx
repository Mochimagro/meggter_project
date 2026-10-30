import { Card, Heading, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { WishlistItem, WishlistItemStatus } from "@/db/database";
import { semanticColors } from "@/theme/semanticColors";

export type ItemCardProps = {
  item: WishlistItem;
  eventName: string;
  actions?: ReactNode;
  footer?: ReactNode;
};

const statusLabels: Record<WishlistItemStatus, string> = {
  not_acquired: "未入手",
  venue_acquired: "会場入手済",
  venue_unacquired: "会場未入手",
  online_purchased: "通販購入済",
  given_up: "諦める",
};

export default function ItemCard({
  item,
  eventName,
  actions,
  footer,
}: ItemCardProps) {
  const isPositive =
    item.status === "venue_acquired" || item.status === "online_purchased";
  const isNegative =
    item.status === "venue_unacquired" || item.status === "given_up";

  return (
    <Card.Root
      backgroundColor={
        isPositive
          ? semanticColors.positive.card
          : isNegative
            ? semanticColors.negative.card
            : undefined
      }
    >
      <Card.Header>
        <Heading size="md">{item.title}</Heading>
      </Card.Header>
      <Card.Body>
        <Text
          color={
            isPositive
              ? semanticColors.positive.text
              : isNegative
                ? semanticColors.negative.text
                : undefined
          }
        >
          状態: {statusLabels[item.status]}
        </Text>
        <Text>頒布イベント: {eventName}</Text>
      </Card.Body>
      {actions && <Card.Footer>{actions}</Card.Footer>}
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card.Root>
  );
}
