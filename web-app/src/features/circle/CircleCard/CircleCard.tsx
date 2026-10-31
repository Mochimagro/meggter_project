// サークルの基本情報をカード形式で表示する。
import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { Circle } from "@/db/database";
import CircleCardBody from "./CircleCardBody";
import CircleCardFooter from "./CircleCardFooter";
import CircleCardHeader from "./CircleCardHeader";

type CircleCardProps = {
  circle: Circle;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  headerActions?: ReactNode;
};

export default function CircleCard({
  circle,
  actions,
  footer,
  children,
  headerActions,
}: CircleCardProps) {
  return (
    <Card.Root position="relative" margin="8px">
      <CircleCardHeader circle={circle} actions={headerActions} />
      <CircleCardBody>{children}</CircleCardBody>
      <CircleCardFooter actions={actions} footer={footer} />
    </Card.Root>
  );
}

export type { CircleCardProps };
