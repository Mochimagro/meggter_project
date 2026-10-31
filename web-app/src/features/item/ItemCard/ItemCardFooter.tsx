import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type ItemCardFooterProps = {
  actions?: ReactNode;
  footer?: ReactNode;
};

export default function ItemCardFooter({
  actions,
  footer,
}: ItemCardFooterProps) {
  return (
    <>
      {actions != null && (
        <Card.Footer justifyContent="flex-end">{actions}</Card.Footer>
      )}
      {footer != null && <Card.Footer>{footer}</Card.Footer>}
    </>
  );
}
