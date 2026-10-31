// アイテムカードの見出し部分を表示する。
import { Flex, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";
import ItemPrice from "../ItemPrice";

export type ItemCardHeaderProps = {
  title: string;
  price: number | null;
  headerContent?: ReactNode;
  headerActions?: ReactNode;
};

export default function ItemCardHeader({
  title,
  price,
  headerContent,
  headerActions,
}: ItemCardHeaderProps) {
  return (
    <>
      {headerActions != null && (
        <Flex position="absolute" top={2} right={2}>
          {headerActions}
        </Flex>
      )}
      {headerContent ?? (
        <>
          <Heading size="md">{title}</Heading>
          <ItemPrice price={price} />
        </>
      )}
    </>
  );
}
