import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { Circle } from "@/db/database";
import { normalizeExternalUrl } from "@/utils/externalUrl";

export type CircleCardHeaderProps = {
  circle: Circle;
  actions?: ReactNode;
  children?: ReactNode;
};

export default function CircleCardHeader({
  circle,
  actions,
  children,
}: CircleCardHeaderProps) {
  const externalUrl = normalizeExternalUrl(circle.circleURL ?? "");

  return (
    <Card.Header position="relative">
      {actions != null && (
        <div style={{ position: "absolute", right: 12, top: 12 }}>{actions}</div>
      )}
      <Stack gap={3} paddingTop={actions != null ? 8 : undefined}>
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
        {children}
      </Stack>
    </Card.Header>
  );
}
