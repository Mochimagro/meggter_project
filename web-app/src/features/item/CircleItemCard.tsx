import {
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { BookCardProps } from "../../entities/CardEntities";
import type { WishlistItemStatus } from "@/db/database";
import { GiTwoCoins } from "react-icons/gi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import {
  deleteWishlistItem,
  setWishlistItemStatus,
  updateWishlistItem,
} from "@/db/recordMutations";
import { semanticColors } from "@/theme/semanticColors";

type CircleItemCardProps = BookCardProps & {
  visitActions?: boolean;
  resultActions?: boolean;
  visited?: boolean;
  disabled?: boolean;
  onStatusChange?: (
    itemId: string,
    status: WishlistItemStatus,
  ) => Promise<void>;
};

const wishlistItemStatuses: {
  value: WishlistItemStatus;
  label: string;
}[] = [
  { value: "not_acquired", label: "未入手" },
  { value: "venue_acquired", label: "会場入手済" },
  { value: "venue_unacquired", label: "会場未入手" },
  { value: "online_purchased", label: "通販購入済" },
  { value: "given_up", label: "諦める" },
];

export default function CircleItemCard({
  id,
  title,
  price,
  status,
  visitActions = false,
  resultActions = false,
  visited = false,
  disabled = false,
  onStatusChange,
}: CircleItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [itemTitle, setItemTitle] = useState(title);
  const [itemPrice, setItemPrice] = useState(
    price === null ? "" : String(price),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [visitError, setVisitError] = useState("");
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

  const handleStatusChange = async (nextStatus: WishlistItemStatus) => {
    if (disabled || visited || isStatusSubmitting || nextStatus === status) {
      return;
    }

    setIsStatusSubmitting(true);
    setVisitError("");
    try {
      if (onStatusChange) {
        await onStatusChange(id, nextStatus);
      } else {
        await setWishlistItemStatus(id, nextStatus);
      }
    } catch (error) {
      console.error("アイテムの入手状態更新に失敗しました。", error);
      setVisitError("状態を更新できませんでした。再度お試しください。");
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  return (
    <Card.Root
      position="relative"
      background={
        status === "venue_acquired" || status === "online_purchased"
          ? semanticColors.positive.card
          : status === "venue_unacquired" || status === "given_up"
            ? semanticColors.negative.card
            : "colorPalette"
      }
    >
      {!visitActions && !resultActions && (
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
      )}
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
      {!isEditing && !visitActions && !resultActions && (
        <Card.Body paddingTop={0}>
          <label>
            <Text as="span" marginRight={2}>
              入手状態
            </Text>
            <select
              aria-label={`${title}の入手状態`}
              value={status}
              disabled={isStatusSubmitting}
              onChange={(event) => {
                const nextStatus = wishlistItemStatuses.find(
                  (option) => option.value === event.target.value,
                );
                if (nextStatus) {
                  void handleStatusChange(nextStatus.value);
                }
              }}
            >
              {wishlistItemStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {visitError && (
            <Text role="alert" color="red.600">
              {visitError}
            </Text>
          )}
        </Card.Body>
      )}
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
      {visitActions && (
        <Card.Footer justifyContent="flex-end" flexWrap="wrap">
          {/*
          <Button
            type="button"
            aria-pressed={status === "venue_acquired"}
            variant={status === "venue_acquired" ? "solid" : "outline"}
            colorPalette="green"
            onClick={() => void handleStatusChange("venue_acquired")}
            disabled={isStatusSubmitting || status === "venue_acquired"}
          >
            入手
          </Button>
          */}
          {visited ? null : (
            <Button
              type="button"
              aria-pressed={status === "venue_unacquired"}
              backgroundColor={semanticColors.negative.button}
              onClick={() =>
                void handleStatusChange(
                  status === "venue_unacquired"
                    ? "not_acquired"
                    : "venue_unacquired",
                )
              }
              disabled={visited}
            >
              {status === "venue_unacquired" ? "完売取り消し" : "完売してた"}
            </Button>
          )}
        </Card.Footer>
      )}
      {resultActions && (
        <Card.Footer justifyContent="flex-end" flexWrap="wrap">
          {visitError && (
            <Text role="alert" color="red.600" marginRight="auto">
              {visitError}
            </Text>
          )}
          <Button
            type="button"
            backgroundColor={semanticColors.positive.button}
            onClick={() => void handleStatusChange("online_purchased")}
            disabled={disabled || isStatusSubmitting}
          >
            通販で買う
          </Button>
          <Button
            type="button"
            backgroundColor={semanticColors.negative.button}
            onClick={() => void handleStatusChange("not_acquired")}
            disabled={disabled || isStatusSubmitting}
          >
            逃す
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
