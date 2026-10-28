import { Card, Flex, Heading, Text } from "@chakra-ui/react";
import type { BookCardProps } from "../entities/CardEntities";
import { GiTwoCoins } from "react-icons/gi";
export default function CircleItemCard({ title, price }: BookCardProps) {
  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">{title}</Heading>
        <Flex align="center" gap={2}>
          <GiTwoCoins />
          <Text>{price === null ? "価格未設定" : `${price}円`}</Text>
        </Flex>
      </Card.Header>
    </Card.Root>
  );
}
