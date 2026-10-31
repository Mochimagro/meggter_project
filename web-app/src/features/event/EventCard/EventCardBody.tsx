// イベントカードの本文領域を表示する。
import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function EventCardBody({ children }: { children?: ReactNode }) {
  if (children == null) {
    return null;
  }
  return <Card.Body>{children}</Card.Body>;
}
