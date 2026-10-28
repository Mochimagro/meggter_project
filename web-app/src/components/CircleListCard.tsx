import { Card, Heading, Text } from "@chakra-ui/react";
import type { Circle } from "@/db/database";

type CircleListCardProps = {
  circle: Circle;
};

export default function CircleListCard({ circle }: CircleListCardProps) {
  return (
    <Card.Root margin="8px">
      <Card.Header>
        <Heading size="md">{circle.circleName || "サークル名未設定"}</Heading>
        {circle.penName && <Text>ペンネーム: {circle.penName}</Text>}
        {circle.genre && <Text>ジャンル: {circle.genre}</Text>}
        {circle.memo && <Text>メモ: {circle.memo}</Text>}
      </Card.Header>
    </Card.Root>
  );
}