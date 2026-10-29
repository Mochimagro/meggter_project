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
import { useNavigate } from "react-router";
import type { Circle } from "@/db/database";
import { deleteCircle, updateCircle } from "@/db/recordMutations";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { normalizeExternalUrl } from "@/utils/externalUrl";

type CircleListCardProps = {
  circle: Circle;
};

export default function CircleListCard({ circle }: CircleListCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [circleName, setCircleName] = useState(circle.circleName);
  const [penName, setPenName] = useState(circle.penName ?? "");
  const [circleURL, setCircleURL] = useState(circle.circleURL ?? "");
  const [genre, setGenre] = useState(circle.genre ?? "");
  const [memo, setMemo] = useState(circle.memo ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const externalUrl = normalizeExternalUrl(circle.circleURL ?? "");

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
            </>
          ) : (
            <>
              <Heading size="md">
                {circle.circleName || "サークル名未設定"}
              </Heading>
              {circle.penName && <Text>ペンネーム: {circle.penName}</Text>}
              {circle.circleURL && (
                <Text>
                  {externalUrl ? (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {circle.circleURL}
                    </a>
                  ) : (
                    circle.circleURL
                  )}
                </Text>
              )}
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
      {isEditing ? (
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
      ) : (
        <Card.Footer justifyContent="flex-end">
          <Button
            type="button"
            onClick={() =>
              navigate(`/circles/${encodeURIComponent(circle.id)}`)
            }
          >
            詳細
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
