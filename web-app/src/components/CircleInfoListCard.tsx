import { Button, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { WishlistItem, WishlistItemStatus } from "@/db/database";
import { deleteWishlistItem } from "@/db/recordMutations";

type CircleInfoListCardProps = {
  item: WishlistItem;
  eventName: string;
};

const statusLabels: Record<WishlistItemStatus, string> = {
  not_acquired: "未入手",
  venue_acquired: "会場入手済",
  venue_unacquired: "会場未入手",
  online_purchased: "通販購入済",
  given_up: "諦める",
};

export default function CircleInfoListCard({
  item,
  eventName,
}: CircleInfoListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (
      isDeleting ||
      !window.confirm("本当に削除しますか？\n※復元できません")
    ) {
      return;
    }

    setIsDeleting(true);
    setError("");
    try {
      await deleteWishlistItem(item.id);
    } catch (cause) {
      console.error("アイテムの削除に失敗しました。", cause);
      setError("アイテムを削除できませんでした。再度お試しください。");
      setIsDeleting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Header>
        <Flex justify="space-between" align="start" gap={3}>
          <Heading size="md">{item.title}</Heading>
          <Button
            type="button"
            colorPalette="red"
            variant="outline"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            削除
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Text>状態: {statusLabels[item.status]}</Text>
        <Text>頒布イベント: {eventName}</Text>
        {error && (
          <Text role="alert" color="red.600">
            {error}
          </Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}
