import { Button, Card, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";
import {
  useAddWishlistItem,
  type NewWishlistItem,
} from "@/hooks/useAddWishlistItem";
import type { CircleCardProps } from "../entities/CardEntities";
import CircleItemCard from "./CircleItemCard";
import EventCircleAddItemCard from "./EventCircleAddItemCard";
import { GiTwoCoins } from "react-icons/gi";

export default function EventCircleListCard({
  circleVisitId,
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
      position="relative"
      className={isEntering ? "circle-card-enter" : undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <Card.Header>
        <Text fontSize="2xl">{space}</Text>
        <Heading size="2xl">{name || "サークル名未設定"}</Heading>
        <Text>{penName}</Text>
        <Flex align="center" gap={2}>
          <GiTwoCoins size={24} />
          <Text fontSize="2xl">
            軍資金: {totalPrice === null ? "価格未設定" : `${totalPrice}円`}
          </Text>
        </Flex>
      </Card.Header>
      <Text
        position="absolute"
        top={3}
        right={3}
        fontWeight="bold"
        color={visited ? "green.600" : "gray.600"}
      >
        {visited ? "巡回済み" : "未巡回"}
      </Text>
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
