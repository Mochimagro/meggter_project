import { Button, Stack, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  deferCircleVisit,
  markCircleVisited,
  undoCircleVisit,
} from "@/db/recordMutations";
import { semanticColors } from "@/theme/semanticColors";

export type CircleTourActionsProps = {
  circleVisitId: string;
  visited: boolean;
  onPendingChange?: (pending: boolean) => void;
};

export default function CircleTourActions({
  circleVisitId,
  visited,
  onPendingChange,
}: CircleTourActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const updateVisit = async (action: typeof markCircleVisited) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    onPendingChange?.(true);
    setError("");
    try {
      await action(circleVisitId);
    } catch (cause) {
      console.error("サークルの巡回状態更新に失敗しました。", cause);
      setError("状態を更新できませんでした。再度お試しください。");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      onPendingChange?.(false);
    }
  };

  return (
    <Stack gap={2} align="end">
      {error && (
        <Text role="alert" color="red.600" marginRight="auto">
          {error}
        </Text>
      )}
      {visited ? (
        <Button
          type="button"
          colorPalette="orange"
          variant="outline"
          onClick={() => void updateVisit(undoCircleVisit)}
          disabled={isSubmitting}
        >
          やっぱめぐってない
        </Button>
      ) : (
        <Stack direction="row" gap={2}>
          <Button
            type="button"
            colorPalette="gray"
            variant="outline"
            onClick={() => void updateVisit(deferCircleVisit)}
            disabled={isSubmitting}
          >
            後で
          </Button>
          <Button
            type="button"
            backgroundColor={semanticColors.positive.button}
            onClick={() => void updateVisit(markCircleVisited)}
            disabled={isSubmitting}
          >
            めぐった
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
