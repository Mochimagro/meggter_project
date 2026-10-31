// アイテムの購入結果を集計して表示する。
import { Box, Text } from "@chakra-ui/react";
import type { BookCardProps } from "@/entities/CardEntities";
import ItemCard from "@/features/item/ItemCard";
import type { ReactNode } from "react";
import { semanticColors } from "@/theme/semanticColors";

export type ItemResultSummaryProps = {
  item: BookCardProps;
  circleName?: string;
  actions?: ReactNode;
  variant?: "card" | "compact";
};

export default function ItemResultSummary({
  item,
  circleName,
  actions,
  variant = "card",
}: ItemResultSummaryProps) {
  const circleLabel = circleName || "サークル名未設定";
  if (variant === "compact") {
    const isPositive =
      item.status === "venue_acquired" || item.status === "online_purchased";
    const isNegative =
      item.status === "venue_unacquired" || item.status === "given_up";

    return (
      <Box as="li">
        <Text>
          {item.title} —{" "}
          <Text
            as="span"
            color={
              isPositive
                ? semanticColors.positive.text
                : isNegative
                  ? semanticColors.negative.text
                  : undefined
            }
          >
            {statusLabels[item.status]}
          </Text>
        </Text>
      </Box>
    );
  }

  return (
    <ItemCard
      item={item}
      actions={actions}
    >
      {circleName && <span>サークル: {circleLabel}</span>}
    </ItemCard>
  );
}

const statusLabels: Record<BookCardProps["status"], string> = {
  not_acquired: "未入手",
  venue_acquired: "会場入手済",
  venue_unacquired: "会場未入手",
  online_purchased: "通販購入済",
  given_up: "諦める",
};
