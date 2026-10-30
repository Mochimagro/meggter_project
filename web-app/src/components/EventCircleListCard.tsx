import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useAddWishlistItem,
  type NewWishlistItem,
} from "@/hooks/useAddWishlistItem";
import type { CircleCardProps } from "../entities/CardEntities";
import InteractiveItemCard from "../features/item/InteractiveItemCard";
import EventCircleAddItemCard from "./EventCircleAddItemCard";
import { GiTwoCoins } from "react-icons/gi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { deleteEventCircle, updateEventCircle } from "@/db/recordMutations";
import { normalizeExternalUrl } from "@/utils/externalUrl";
import { semanticColors } from "@/theme/semanticColors";

export default function EventCircleListCard({
  id,
  circleVisitId,
  visited,
  name,
  penName,
  circleURL,
  space,
  totalPrice,
  books,
  isEntering = false,
  onAnimationEnd,
}: CircleCardProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [circleName, setCircleName] = useState(name);
  const [circlePenName, setCirclePenName] = useState(penName);
  const [circleURLInput, setCircleURLInput] = useState(circleURL ?? "");
  const [circleSpace, setCircleSpace] = useState(space);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const addWishlistItem = useAddWishlistItem();
  const externalUrl = normalizeExternalUrl(circleURL ?? "");
  const canUpdate =
    circleName.trim().length > 0 && circleSpace.trim().length > 0;

  const handleStartEditing = () => {
    setCircleName(name);
    setCirclePenName(penName);
    setCircleURLInput(circleURL ?? "");
    setCircleSpace(space);
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setCircleName(name);
    setCirclePenName(penName);
    setCircleURLInput(circleURL ?? "");
    setCircleSpace(space);
    setEditError("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!canUpdate || isSubmitting) {
      return;
    }

    const normalizedCircleURL = normalizeExternalUrl(circleURLInput);
    if (circleURLInput.trim() && !normalizedCircleURL) {
      setEditError(
        "URLはhttpまたはhttpsから始まる正しい形式で入力してください。",
      );
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await updateEventCircle(id, circleVisitId, {
        circleName: circleName.trim(),
        penName: circlePenName.trim() || null,
        circleURL: normalizedCircleURL,
        space: circleSpace.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("イベント内サークルの更新に失敗しました。", error);
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
      await deleteEventCircle(circleVisitId);
    } catch (error) {
      console.error("イベント内サークルの削除に失敗しました。", error);
      setEditError("サークルを削除できませんでした。再度お試しください。");
      setIsSubmitting(false);
    }
  };

  const handleAddWishlistItem = async (item: NewWishlistItem) => {
    const itemId = await addWishlistItem(circleVisitId, item);
    setIsAddingItem(false);
    return itemId;
  };

  return (
    <Card.Root
      position="relative"
      backgroundColor={visited ? semanticColors.positive.card : undefined}
      className={isEntering ? "circle-card-enter" : undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <Card.Header>
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
                <Field.Label>サークル主名</Field.Label>
                <Input
                  aria-label="サークル主名"
                  value={circlePenName}
                  onChange={(event) => setCirclePenName(event.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>URL</Field.Label>
                <Input
                  aria-label="URL"
                  type="url"
                  value={circleURLInput}
                  onChange={(event) => setCircleURLInput(event.target.value)}
                  placeholder="https://x.com/ または pixiv.net/"
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>配置場所</Field.Label>
                <Input
                  aria-label="配置場所"
                  value={circleSpace}
                  onChange={(event) => setCircleSpace(event.target.value)}
                />
              </Field.Root>
            </>
          ) : (
            <>
              <Text fontSize="2xl">{space}</Text>
              <Heading size="2xl">{name || "サークル名未設定"}</Heading>
              <Text>{penName}</Text>
              {circleURL && (
                <Text typeof="url">
                  {externalUrl ? (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {circleURL}
                    </a>
                  ) : (
                    circleURL
                  )}
                </Text>
              )}
              <Flex align="center" gap={2}>
                <GiTwoCoins size={24} />
                <Text fontSize="2xl">
                  軍資金:{" "}
                  {totalPrice === null ? "価格未設定" : `${totalPrice}円`}
                </Text>
              </Flex>
            </>
          )}
        </Stack>
      </Card.Header>
      <Text
        position="absolute"
        top={3}
        left={3}
        fontWeight="bold"
        color={visited ? semanticColors.positive.text : "gray.600"}
      >
        {visited ? "巡回済み" : "未巡回"}
      </Text>
      <Card.Body>
        <Stack>
          {books.map((book) => (
            <InteractiveItemCard key={book.id} {...book} />
          ))}
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {editError && (
          <Text role="alert" color="red.600" marginRight="auto">
            {editError}
          </Text>
        )}
        {isEditing ? (
          <>
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
              disabled={!canUpdate || isSubmitting}
            >
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => setIsAddingItem(true)}
            disabled={isAddingItem}
          >
            買うもの追加
          </Button>
        )}
      </Card.Footer>
      {isAddingItem && (
        <EventCircleAddItemCard
          onAdd={handleAddWishlistItem}
          onCancel={() => setIsAddingItem(false)}
        />
      )}
    </Card.Root>
  );
}
