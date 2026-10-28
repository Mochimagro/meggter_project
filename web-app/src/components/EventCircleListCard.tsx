import { Button, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import {
  useAddWishlistItem,
  type NewWishlistItem,
} from "@/hooks/useAddWishlistItem";
import type { CircleCardProps } from "../entities/CardEntities";
import CircleItemCard from "./CircleItemCard";
import EventCircleAddItemCard from "./EventCircleAddItemCard";

export default function EventCircleListCard({
  circleVisitId,
  priority,
  visited,
  name,
  penName,
  space,
  totalPrice,
  books,
  isEntering = false,
  onAnimationEnd,
}: CircleCardProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const addWishlistItem = useAddWishlistItem();
  const handleAddWishlistItem = async (item: NewWishlistItem) => {
    const itemId = await addWishlistItem(circleVisitId, item);
    setIsAddingItem(false);
    return itemId;
  };

  return (
    <Card.Root
      className={isEntering ? "circle-card-enter" : undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <Card.Header>
        <Text>優先順位: {priority}</Text>
        <Text>巡回状況: {visited ? "巡回済み" : "未巡回"}</Text>
        <Heading size="md">{name || "サークル名未設定"}</Heading>
        <Text>{penName}</Text>
        <Text>スペース: {space}</Text>
        <Text>
          合計: {totalPrice === null ? "価格未設定" : `${totalPrice}円`}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {books.map((book, index) => (
            <CircleItemCard key={`${book.title}-${index}`} {...book} />
          ))}
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button
          type="button"
          onClick={() => setIsAddingItem(true)}
          disabled={isAddingItem}
        >
          買うもの追加
        </Button>
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
