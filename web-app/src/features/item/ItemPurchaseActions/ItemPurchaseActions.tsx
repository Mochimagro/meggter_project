// アイテムの購入状態を変更する操作を提供する。
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import type { WishlistItemStatus } from "@/db/database";
import { setWishlistItemStatus } from "@/db/recordMutations";
import { semanticColors } from "@/theme/semanticColors";

export type ItemPurchaseActionsProps = {
  itemId: string;
  status: WishlistItemStatus;
  mode: "visit" | "result";
  visited?: boolean;
  disabled?: boolean;
  onStatusChange?: (
    itemId: string,
    status: WishlistItemStatus,
  ) => Promise<void>;
};

export default function ItemPurchaseActions({
  itemId,
  status,
  mode,
  visited = false,
  disabled = false,
  onStatusChange,
}: ItemPurchaseActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  const changeStatus = async (nextStatus: WishlistItemStatus) => {
    if (disabled || submittingRef.current || nextStatus === status) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      if (onStatusChange) {
        await onStatusChange(itemId, nextStatus);
      } else {
        await setWishlistItemStatus(itemId, nextStatus);
      }
    } catch (cause) {
      console.error("アイテムの入手状態更新に失敗しました。", cause);
      setError("状態を更新できませんでした。再度お試しください。");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap={2} align="end">
      {error && (
        <Text role="alert" color="red.600" marginRight="auto">
          {error}
        </Text>
      )}
      {mode === "visit" ? (
        visited ? null : (
          <Button
            type="button"
            aria-pressed={status === "venue_unacquired"}
            backgroundColor={semanticColors.negative.button}
            onClick={() =>
              void changeStatus(
                status === "venue_unacquired"
                  ? "not_acquired"
                  : "venue_unacquired",
              )
            }
            disabled={disabled || isSubmitting}
          >
            {status === "venue_unacquired" ? "完売取り消し" : "完売してた"}
          </Button>
        )
      ) : (
        <Stack direction="row" gap={2}>
          <Button
            type="button"
            backgroundColor={semanticColors.positive.button}
            onClick={() => void changeStatus("online_purchased")}
            disabled={disabled || isSubmitting}
          >
            通販で買う
          </Button>
          <Button
            type="button"
            backgroundColor={semanticColors.negative.button}
            onClick={() => void changeStatus("not_acquired")}
            disabled={disabled || isSubmitting}
          >
            逃す
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
