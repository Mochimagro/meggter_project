// イベント追加フォームを開くボタンを表示する。
import { Button, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function EventAddButton() {
  const navigate = useNavigate();
  return (
    <Button
      aria-label="イベントを追加"
      position="fixed"
      right={6}
      bottom={6}
      zIndex="tooltip"
      width="56px"
      height="56px"
      padding={0}
      borderRadius="full"
      overflow="hidden"
      justifyContent="flex-start"
      backgroundColor="blue.500"
      color="white"
      boxShadow="lg"
      className="group"
      transition="width 0.25s ease, background-color 0.2s ease"
      _hover={{ width: "190px", backgroundColor: "blue.600" }}
      _focusVisible={{ width: "190px" }}
      onClick={() => navigate("/events/edit")}
    >
      <FaPlus style={{ flexShrink: 0, marginLeft: "20px" }} />
      <Text
        maxWidth={0}
        overflow="hidden"
        whiteSpace="nowrap"
        opacity={0}
        transition="max-width 0.25s ease, opacity 0.2s ease"
        _groupHover={{ maxWidth: "130px", opacity: 1 }}
        _groupFocusVisible={{ maxWidth: "130px", opacity: 1 }}
      >
        イベントを追加
      </Text>
    </Button>
  );
}
