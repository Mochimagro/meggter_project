import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { deleteWishlistItem } from "@/db/recordMutations";

type ItemDeleteActionsProps = {
  itemId: string;
};

export default function ItemDeleteActions({
  itemId,
}: ItemDeleteActionsProps) {
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
      await deleteWishlistItem(itemId);
    } catch (cause) {
      console.error("アイテムの削除に失敗しました。", cause);
      setError("アイテムを削除できませんでした。再度お試しください。");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && (
        <Text role="alert" color="red.600" marginRight="auto">
          {error}
        </Text>
      )}
      <Button
        type="button"
        colorPalette="red"
        variant="outline"
        onClick={() => void handleDelete()}
        disabled={isDeleting}
      >
        削除
      </Button>
    </>
  );
}
