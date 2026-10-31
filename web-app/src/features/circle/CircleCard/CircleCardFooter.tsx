// サークルカードの操作や補足情報を表示するフッター。
import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type CircleCardFooterProps = {
  actions?: ReactNode;
  footer?: ReactNode;
};

export default function CircleCardFooter({
  actions,
  footer,
}: CircleCardFooterProps) {
  return (
    <>
      {actions != null && (
        <Card.Footer justifyContent="flex-end">{actions}</Card.Footer>
      )}
      {footer != null && <Card.Footer>{footer}</Card.Footer>}
    </>
  );
}
