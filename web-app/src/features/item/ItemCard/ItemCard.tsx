import { Card } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { WishlistItem } from "@/db/database";
import { semanticColors } from "@/theme/semanticColors";
import ItemCardBody from "./ItemCardBody";
import ItemCardFooter from "./ItemCardFooter";
import ItemCardHeader from "./ItemCardHeader";

export type ItemCardProps = {
  item: Pick<WishlistItem, "id" | "title" | "price" | "status">;
  eventName?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  headerContent?: ReactNode;
  headerActions?: ReactNode;
  children?: ReactNode;
  showBody?: boolean;
};

export default function ItemCard({
  item,
  eventName,
  actions,
  footer,
  headerContent,
  headerActions,
  children,
  showBody = true,
}: ItemCardProps) {
  return (
    <Card.Root
      position="relative"
      backgroundColor={
        item.status === "venue_acquired" || item.status === "online_purchased"
          ? semanticColors.positive.card
          : item.status === "venue_unacquired" || item.status === "given_up"
            ? semanticColors.negative.card
            : undefined
      }
    >
      <Card.Header paddingTop={headerActions != null ? 10 : undefined}>
        <ItemCardHeader
          title={item.title}
          price={item.price}
          headerContent={headerContent}
          headerActions={headerActions}
        />
      </Card.Header>
      {showBody && (
        <ItemCardBody
          status={item.status}
          eventName={eventName}
        >
          {children}
        </ItemCardBody>
      )}
      <ItemCardFooter actions={actions} footer={footer} />
    </Card.Root>
  );
}
