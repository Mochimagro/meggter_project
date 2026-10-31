// アイテムの価格を表示する。
import { Flex, Text } from "@chakra-ui/react";
import { GiTwoCoins } from "react-icons/gi";

export type ItemPriceProps = {
  price: number | null;
};

export default function ItemPrice({ price }: ItemPriceProps) {
  return (
    <Flex align="center" gap={2}>
      <GiTwoCoins />
      <Text>{price === null ? "価格未設定" : `${price}円`}</Text>
    </Flex>
  );
}
