// サークルカードの本文領域を表示する。
import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function CircleCardBody({ children }: { children?: ReactNode }) {
  return children == null ? null : <Card.Body>{children}</Card.Body>;
}
