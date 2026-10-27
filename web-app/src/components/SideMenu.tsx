import { Button, Drawer, Portal, Stack } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router";

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <Button
        position="relative"
        right={4}
        color="white"
        variant="ghost"
        aria-label="サイドメニューを開く"
        onClick={() => setIsOpen(true)}
      >
        <FaBars />
      </Button>
      <Drawer.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>メニュー</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack gap={3}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigateTo("/")}
                  >
                    トップ
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigateTo("/events")}
                  >
                    イベント一覧
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigateTo("/events/edit")}
                  >
                    イベント編集
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    onClick={() => navigateTo("/events/info")}
                  >
                    イベント情報
                  </Button>
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <Button
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  variant="ghost"
                  aria-label="サイドメニューを閉じる"
                >
                  ×
                </Button>
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
