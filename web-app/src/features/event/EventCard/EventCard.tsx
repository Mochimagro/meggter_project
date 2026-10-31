// イベント情報をカード形式で表示する。
import { Card } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import EventCardBody from "./EventCardBody";
import EventCardFooter from "./EventCardFooter";
import EventCardHeader from "./EventCardHeader";

export type EventCardProps = {
  eventId: string;
  title: string;
  date: string;
  venue: string;
  entranceFee?: number | null;
  transportationExpenses?: number | null;
  headerContent?: ReactNode;
  headerActions?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  backgroundColor?: ComponentProps<typeof Card.Root>["backgroundColor"];
  margin?: ComponentProps<typeof Card.Root>["margin"];
};

export default function EventCard({
  eventId,
  title,
  date,
  venue,
  entranceFee,
  transportationExpenses,
  headerContent,
  headerActions,
  children,
  actions,
  footer,
  backgroundColor,
  margin,
}: EventCardProps) {
  return (
    <Card.Root
      data-event-id={eventId}
      position="relative"
      backgroundColor={backgroundColor}
      margin={margin}
    >
      <Card.Header>
        <EventCardHeader
          title={title}
          date={date}
          venue={venue}
          entranceFee={entranceFee}
          transportationExpenses={transportationExpenses}
          headerContent={headerContent}
          headerActions={headerActions}
        />
      </Card.Header>
      <EventCardBody>{children}</EventCardBody>
      <EventCardFooter actions={actions} footer={footer} />
    </Card.Root>
  );
}
