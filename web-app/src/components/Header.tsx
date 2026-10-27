import { Flex, Text, VStack } from "@chakra-ui/react";
import { SideMenu } from "./SideMenu";

type HeaderProps = {
  pageName: string;
};

export function Header({ pageName }: HeaderProps) {
  return (
    <Flex
      as="header"
      position="relative"
      justify="flex-start"
      align="center"
      bg="blue.300"
      color="white"
      py={4}
      px={4}
      boxShadow="md"
    >
      <SideMenu />
      <VStack align="start" gap={0}>
        <Text fontSize="xl" fontWeight="bold">
          めぐったー
        </Text>
        <Text>{pageName}</Text>
      </VStack>
    </Flex>
  );
}
