import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  Text,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { isBefore, isToday, isValid, parseISO, startOfToday } from "date-fns";
import type { EventListCardProps } from "../entities/CardEntities";
import { useNavigate } from "react-router";
import { BsMap } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { deleteEvent, updateEvent } from "@/db/recordMutations";

function toInputDate(date: string) {
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    return date;
  }
  const japaneseDate = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  return japaneseDate
    ? `${japaneseDate[1]}-${japaneseDate[2].padStart(2, "0")}-${japaneseDate[3].padStart(2, "0")}`
    : "";
}

export default function EventListCard({
  id,
  title,
  date,
  venue,
  status,
}: EventListCardProps) {
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const japaneseDate = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  const dateToCheck = isoDate
    ? date
    : japaneseDate
      ? `${japaneseDate[1]}-${japaneseDate[2].padStart(2, "0")}-${japaneseDate[3].padStart(2, "0")}`
      : null;
  const parsedDate = dateToCheck ? parseISO(dateToCheck) : null;
  const isValidEventDate = parsedDate !== null && isValid(parsedDate);
  const isEventToday = isValidEventDate && isToday(parsedDate);
  const isPastEvent = isValidEventDate && isBefore(parsedDate, startOfToday());
  const shouldShowResult = status === "withdrawn" || isPastEvent;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(title);
  const [eventDate, setEventDate] = useState(toInputDate(date));
  const [eventVenue, setEventVenue] = useState(venue ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const handleStartEditing = () => {
    setEventName(title);
    setEventDate(toInputDate(date));
    setEventVenue(venue ?? "");
    setEditError("");
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEventName(title);
    setEventDate(toInputDate(date));
    setEventVenue(venue ?? "");
    setEditError("");
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!eventName.trim() || !eventDate || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await updateEvent(id, {
        name: eventName.trim(),
        eventDate,
        venue: eventVenue.trim() || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("イベントの更新に失敗しました。", error);
      setEditError("イベントを更新できませんでした。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      isSubmitting ||
      !window.confirm("本当に削除しますか？\n※復元できません")
    ) {
      return;
    }

    setIsSubmitting(true);
    setEditError("");
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error("イベントの削除に失敗しました。", error);
      setEditError("イベントを削除できませんでした。再度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root
      position="relative"
      margin="8px"
      backgroundColor={
        isPastEvent ? "gray.400" : isEventToday ? "red.400" : "colorPalette"
      }
    >
      <Card.Header>
        <Flex position="absolute" top={3} right={3}>
          {isEditing ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelEditing}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="イベントを編集"
              title="編集"
              onClick={handleStartEditing}
            >
              <HiOutlinePencilSquare />
            </Button>
          )}
        </Flex>
        <Stack gap={3} paddingTop={8}>
          {isEditing ? (
            <>
              <Field.Root required>
                <Field.Label>イベント名</Field.Label>
                <Input
                  aria-label="イベント名"
                  value={eventName}
                  onChange={(event) => setEventName(event.target.value)}
                />
              </Field.Root>
              <Field.Root required>
                <Field.Label>開催日</Field.Label>
                <Input
                  aria-label="開催日"
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>会場・開催地</Field.Label>
                <Input
                  aria-label="会場・開催地"
                  value={eventVenue}
                  onChange={(event) => setEventVenue(event.target.value)}
                />
              </Field.Root>
            </>
          ) : (
            <>
              <Heading size="4xl">{title}</Heading>
              <Flex align="center" gap={2}>
                <FaCalendarAlt />
                <Text>{date}</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <BsMap />
                <Text>{venue}</Text>
              </Flex>
            </>
          )}
        </Stack>
      </Card.Header>
      <Card.Body>
        <Text
          position="absolute"
          top={3}
          left={3}
          fontWeight="bold"
          color={status === "withdrawn" || isPastEvent ? "green.600" : "gray.600"}
        >
          {status === "withdrawn"
            ? "撤退済み"
            : isPastEvent
              ? "終了"
              : isEventToday
                ? "当日"
                : "開催前"}
        </Text>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {editError && (
          <Text role="alert" color="red.700" marginRight="auto">
            {editError}
          </Text>
        )}
        {isEditing ? (
          <>
            <Button
              type="button"
              backgroundColor="red.600"
              color="white"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              削除
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={!eventName.trim() || !eventDate || isSubmitting}
            >
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
          </>
        ) : shouldShowResult ? (
          <Button
            type="button"
            onClick={() =>
              navigate(`/events/${encodeURIComponent(id)}/result`)
            }
            margin="4px"
            backgroundColor="green.600"
          >
            結果
          </Button>
        ) : isEventToday ? (
          <Button
            type="button"
            margin="4px"
            backgroundColor={"red.500"}
            onClick={() => navigate(`/events/${encodeURIComponent(id)}/visit`)}
          >
            巡る
          </Button>
        ) : (
          <Button
            onClick={() => navigate(`/events/${encodeURIComponent(id)}`)}
            margin="4px"
            backgroundColor={"blue.500"}
          >
            詳細
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
