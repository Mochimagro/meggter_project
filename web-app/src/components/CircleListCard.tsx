import {
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Circle } from "@/db/database";
import { deleteCircle, updateCircle } from "@/db/recordMutations";
import { HiOutlinePencilSquare } from "react-icons/hi2";

type CircleListCardProps = {
  circle: Circle;
};

export default function CircleListCard({ circle }: CircleListCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [circleName, setCircleName] = useState(circle.circleName);
  const [penName, setPenName] = useState(circle.penName ?? "");
  const [genre, setGenre] = useState(circle.genre ?? "");
  const [memo, setMemo] = useState(circle.memo ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const handleStartEditing = () => {
    setCircleName(circle.circleName);
    setPenName(circle.penName ?? "");
    setGenre(circle.genre ?? "");
    setMemo(circle.memo ?? "");
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setCircleName(circle.circleName);
    setPenName(circle.penName ?? "");
    setGenre(circle.genre ?? "");
    setMemo(circle.memo ?? "");
    setEditError("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!circleName.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await updateCircle(circle.id, {
        circleName: circleName.trim(),
        penName: penName.trim() || null,
        genre: genre.trim() || null,
        memo: memo.trim() || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("サークルの更新に失敗しました。", error);
      setEditError("サークルを更新できませんでした。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      isSubmitting ||
      !window.confirm("本当に削除しますか？\n※復元できません")
    ) {
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await deleteCircle(circle.id);
    } catch (error) {
      console.error("サークルの削除に失敗しました。", error);
      setEditError("サークルを削除できませんでした。再度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root position="relative" margin="8px">
      <Card.Header>
        <Stack gap={3} paddingTop={8}>
          {isEditing ? (
            <>
              <Field.Root required>
                <Field.Label>サークル名</Field.Label>
                <Input
                  aria-label="サークル名"
                  value={circleName}
                  onChange={(event) => setCircleName(event.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>ペンネーム</Field.Label>
                <Input
                  aria-label="ペンネーム"
                  value={penName}
                  onChange={(event) => setPenName(event.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>ジャンル</Field.Label>
                <Input
                  aria-label="ジャンル"
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>メモ</Field.Label>
                <Input
                  aria-label="メモ"
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                />
              </Field.Root>
            </>
          ) : (
            <>
              <Heading size="md">
                {circle.circleName || "サークル名未設定"}
              </Heading>
              {circle.penName && <Text>ペンネーム: {circle.penName}</Text>}
              {circle.genre && <Text>ジャンル: {circle.genre}</Text>}
              {circle.memo && <Text>メモ: {circle.memo}</Text>}
            </>
          )}
        </Stack>
        <Flex position="absolute" top={3} right={3}>
          {isEditing ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelEditing}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="サークルを編集"
              title="編集"
              onClick={handleStartEditing}
            >
              <HiOutlinePencilSquare />
            </Button>
          )}
        </Flex>
      </Card.Header>
      {isEditing && (
        <Card.Footer justifyContent="flex-end">
          {editError && (
            <Text role="alert" color="red.600" marginRight="auto">
              {editError}
            </Text>
          )}
          <Button
            type="button"
            backgroundColor="red.600"
            color="white"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            削除
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={!circleName.trim() || isSubmitting}
          >
            {isSubmitting ? "更新中..." : "更新"}
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
