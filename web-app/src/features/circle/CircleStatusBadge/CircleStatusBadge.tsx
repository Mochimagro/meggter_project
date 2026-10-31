// サークルの状態をバッジで表示する。
import { Text } from "@chakra-ui/react";
import { semanticColors } from "@/theme/semanticColors";

export type CircleStatusBadgeProps = {
  visited: boolean;
};

export default function CircleStatusBadge({
  visited,
}: CircleStatusBadgeProps) {
  return (
    <Text
      position="absolute"
      top={3}
      left={3}
      fontWeight="bold"
      color={visited ? semanticColors.positive.text : "gray.600"}
      aria-live="polite"
    >
      {visited ? "巡回済み" : "未巡回"}
    </Text>
  );
}
