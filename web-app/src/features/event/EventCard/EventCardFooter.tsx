import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type EventCardFooterProps = {
  actions?: ReactNode;
  footer?: ReactNode;
};

export default function EventCardFooter({
  actions,
  footer,
}: EventCardFooterProps) {
  return (
    <>
      {actions != null && (
        <Card.Footer justifyContent="flex-end">{actions}</Card.Footer>
      )}
      {footer != null && <Card.Footer>{footer}</Card.Footer>}
    </>
  );
}
