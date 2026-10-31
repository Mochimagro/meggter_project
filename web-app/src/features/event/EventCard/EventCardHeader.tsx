import { Flex, Heading, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import EventSchedule from "../EventSchedule";

export type EventCardHeaderProps = {
  title: string;
  date: string;
  venue: string;
  entranceFee?: number | null;
  transportationExpenses?: number | null;
  headerContent?: ReactNode;
  headerActions?: ReactNode;
};

export default function EventCardHeader({
  title,
  date,
  venue,
  entranceFee,
  transportationExpenses,
  headerContent,
  headerActions,
}: EventCardHeaderProps) {
  return (
    <>
      {headerActions != null && (
        <Flex position="absolute" top={3} right={3}>
          {headerActions}
        </Flex>
      )}
      {headerContent ?? (
        <Stack gap={3} paddingTop={headerActions != null ? 8 : undefined}>
          <Heading size="4xl">{title}</Heading>
          <EventSchedule
            date={date}
            venue={venue}
            entranceFee={entranceFee}
            transportationExpenses={transportationExpenses}
          />
        </Stack>
      )}
    </>
  );
}
