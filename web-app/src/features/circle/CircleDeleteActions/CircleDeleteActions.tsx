import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { deleteCircle } from "@/db/recordMutations";

type CircleDeleteActionsProps = {
  circleId: string;
};

export default function CircleDeleteActions({
  circleId,
}: CircleDeleteActionsProps) {
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
      await deleteCircle(circleId);
    } catch (cause) {
      console.error("サークルの削除に失敗しました。", cause);
      setError("サークルを削除できませんでした。再度お試しください。");
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
        backgroundColor="red.600"
        color="white"
        onClick={() => void handleDelete()}
        disabled={isDeleting}
      >
        削除
      </Button>
    </>
  );
}
