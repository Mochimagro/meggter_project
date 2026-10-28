import { Button, Card, Field, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { BookCardProps } from "../entities/CardEntities";
import { GiTwoCoins } from "react-icons/gi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  deleteWishlistItem,
  updateWishlistItem,
} from "@/db/recordMutations";

export default function CircleItemCard({ id, title, price }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [itemTitle, setItemTitle] = useState(title);
  const [itemPrice, setItemPrice] = useState(
    price === null ? "" : String(price),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const parsedPrice = itemPrice === "" ? null : Number(itemPrice);
  const canUpdate =
    itemTitle.trim().length > 0 &&
    (parsedPrice === null ||
      (Number.isFinite(parsedPrice) && parsedPrice >= 0));

  const handleStartEditing = () => {
    setItemTitle(title);
    setItemPrice(price === null ? "" : String(price));
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setItemTitle(title);
    setItemPrice(price === null ? "" : String(price));
    setEditError("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!canUpdate || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await updateWishlistItem(id, {
        title: itemTitle.trim(),
        price: parsedPrice,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("購入予定アイテムの更新に失敗しました。", error);
      setEditError("アイテムを更新できませんでした。再度お試しください。");
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
      await deleteWishlistItem(id);
    } catch (error) {
      console.error("購入予定アイテムの削除に失敗しました。", error);
      setEditError("アイテムを削除できませんでした。再度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root position="relative">
      <Flex position="absolute" top={2} right={2}>
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
            aria-label="購入予定アイテムを編集"
            title="編集"
            onClick={handleStartEditing}
          >
            <HiOutlinePencilSquare />
          </Button>
        )}
      </Flex>
      <Card.Header paddingTop={10}>
        {isEditing ? (
          <>
            <Field.Root required>
              <Field.Label>買うもの</Field.Label>
              <Input
                aria-label="買うもの"
                value={itemTitle}
                onChange={(event) => setItemTitle(event.target.value)}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>価格</Field.Label>
              <Input
                aria-label="価格"
                type="number"
                min="0"
                step="1"
                value={itemPrice}
                onChange={(event) => setItemPrice(event.target.value)}
              />
            </Field.Root>
          </>
        ) : (
          <>
            <Heading size="md">{title}</Heading>
            <Flex align="center" gap={2}>
              <GiTwoCoins />
              <Text>{price === null ? "価格未設定" : `${price}円`}</Text>
            </Flex>
          </>
        )}
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
            disabled={!canUpdate || isSubmitting}
          >
            {isSubmitting ? "更新中..." : "更新"}
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
