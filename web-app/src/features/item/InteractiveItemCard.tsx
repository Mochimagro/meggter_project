import {
  Button,
  Field,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { BookCardProps } from "@/entities/CardEntities";
import type { WishlistItemStatus } from "@/db/database";
import {
  deleteWishlistItem,
  setWishlistItemStatus,
  updateWishlistItem,
} from "@/db/recordMutations";
import ItemCard from "@/features/item/ItemCard";
import ItemPurchaseActions from "@/features/item/ItemPurchaseActions";
import { HiOutlinePencilSquare } from "react-icons/hi2";

type InteractiveItemCardProps = BookCardProps & {
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

export default function InteractiveItemCard({
  id,
  title,
  price,
  status,
  visitActions = false,
  resultActions = false,
  visited = false,
  disabled = false,
  onStatusChange,
}: InteractiveItemCardProps) {
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
  const isActionCard = visitActions || resultActions;

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
    <ItemCard
      item={{ id, title, price, status }}
      showBody={!isEditing && !isActionCard}
      headerActions={
        isActionCard
          ? undefined
          : isEditing
            ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEditing}
                  disabled={isSubmitting}
                >
                  キャンセル
                </Button>
              )
            : (
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
              )
      }
      headerContent={
        isEditing ? (
          <Stack gap={3} paddingTop={8}>
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
          </Stack>
        ) : undefined
      }
      actions={
        isEditing ? (
          <>
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
          </>
        ) : visitActions || resultActions ? (
          <ItemPurchaseActions
            itemId={id}
            status={status}
            mode={visitActions ? "visit" : "result"}
            visited={visited}
            disabled={disabled}
            onStatusChange={onStatusChange}
          />
        ) : undefined
      }
    >
      {!isEditing && !isActionCard && (
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
      )}
      {!isEditing && visitError && (
        <Text role="alert" color="red.600">
          {visitError}
        </Text>
      )}
    </ItemCard>
  );
}
