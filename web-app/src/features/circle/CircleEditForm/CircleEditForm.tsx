// サークル情報を編集するフォームを表示する。
import {
  Button,
  Field,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Circle } from "@/db/database";
import { updateCircle } from "@/db/recordMutations";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { normalizeExternalUrl } from "@/utils/externalUrl";
import CircleDeleteActions from "../CircleDeleteActions/CircleDeleteActions";

type CircleEditFormProps = {
  circle: Circle;
};

export default function CircleEditForm({ circle }: CircleEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [circleName, setCircleName] = useState(circle.circleName);
  const [penName, setPenName] = useState(circle.penName ?? "");
  const [circleURL, setCircleURL] = useState(circle.circleURL ?? "");
  const [genre, setGenre] = useState(circle.genre ?? "");
  const [memo, setMemo] = useState(circle.memo ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const handleStartEditing = () => {
    setCircleName(circle.circleName);
    setPenName(circle.penName ?? "");
    setCircleURL(circle.circleURL ?? "");
    setGenre(circle.genre ?? "");
    setMemo(circle.memo ?? "");
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setCircleName(circle.circleName);
    setPenName(circle.penName ?? "");
    setCircleURL(circle.circleURL ?? "");
    setGenre(circle.genre ?? "");
    setMemo(circle.memo ?? "");
    setEditError("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!circleName.trim() || isSubmitting) {
      return;
    }

    const normalizedCircleURL = normalizeExternalUrl(circleURL);
    if (circleURL.trim() && !normalizedCircleURL) {
      setEditError(
        "URLはhttpまたはhttpsから始まる正しい形式で入力してください。",
      );
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await updateCircle(circle.id, {
        circleName: circleName.trim(),
        penName: penName.trim() || null,
        circleURL: normalizedCircleURL,
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

  return (
    <>
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
      {isEditing && (
        <Stack gap={3}>
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
            <Field.Label>URL</Field.Label>
            <Input
              aria-label="URL"
              type="url"
              value={circleURL}
              onChange={(event) => setCircleURL(event.target.value)}
              placeholder="Twitter(現X)やPixivなどのURLを記入してください"
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
          <Flex justify="flex-end" align="center" gap={2} flexWrap="wrap">
            {editError && (
              <Text role="alert" color="red.600" marginRight="auto">
                {editError}
              </Text>
            )}
            <CircleDeleteActions circleId={circle.id} />
            <Button
              type="button"
              onClick={() => void handleUpdate()}
              disabled={!circleName.trim() || isSubmitting}
            >
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
          </Flex>
        </Stack>
      )}
    </>
  );
}
