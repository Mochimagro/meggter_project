import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { Circle } from "@/db/database";
import { normalizeExternalUrl } from "@/utils/externalUrl";

type CircleCardProps = {
  circle: Circle;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
};

export default function CircleCard({
  circle,
  actions,
  footer,
  children,
}: CircleCardProps) {
  const externalUrl = normalizeExternalUrl(circle.circleURL ?? "");

  return (
    <Card.Root position="relative" margin="8px">
      <Card.Header>
        <Stack gap={3} paddingTop={8}>
          <Heading size="md">{circle.circleName || "サークル名未設定"}</Heading>
          {circle.penName && <Text>ペンネーム: {circle.penName}</Text>}
          {circle.circleURL && (
            <Text>
              {externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {circle.circleURL}
                </a>
              ) : (
                circle.circleURL
              )}
            </Text>
          )}
          {circle.genre && <Text>ジャンル: {circle.genre}</Text>}
          {circle.memo && <Text>メモ: {circle.memo}</Text>}
        </Stack>
      </Card.Header>
      {children != null && <Card.Body>{children}</Card.Body>}
      {actions != null && (
        <Card.Footer justifyContent="flex-end">{actions}</Card.Footer>
      )}
      {footer != null && <Card.Footer>{footer}</Card.Footer>}
    </Card.Root>
  );
}

export type { CircleCardProps };
