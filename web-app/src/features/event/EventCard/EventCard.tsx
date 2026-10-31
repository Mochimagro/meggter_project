import { Card, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { BsMap } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";

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
      <Card.Header position="relative">
        {headerActions != null && (
          <Flex position="absolute" top={3} right={3}>
            {headerActions}
          </Flex>
        )}
        {headerContent ?? (
          <Stack gap={3} paddingTop={headerActions != null ? 8 : undefined}>
            <Heading size="4xl">{title}</Heading>
            <Flex align="center" gap={2}>
              <FaCalendarAlt />
              <Text>{date}</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <BsMap />
              <Text>{venue}</Text>
            </Flex>
            {entranceFee != null && (
              <Text>参加費：{entranceFee.toLocaleString()}円</Text>
            )}
            {transportationExpenses != null && (
              <Text>交通費：{transportationExpenses.toLocaleString()}円</Text>
            )}
          </Stack>
        )}
      </Card.Header>
      {children != null && (
        <Card.Body>{children}</Card.Body>
      )}
      {actions != null && (
        <Card.Footer justifyContent="flex-end">{actions}</Card.Footer>
      )}
      {footer != null && <Card.Footer>{footer}</Card.Footer>}
    </Card.Root>
  );
}
