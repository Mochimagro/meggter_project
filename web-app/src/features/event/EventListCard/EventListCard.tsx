import {
  Button,
  Field,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { EventListCardProps } from "@/entities/CardEntities";
import { useNavigate } from "react-router";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { deleteEvent, updateEvent } from "@/db/recordMutations";
import { semanticColors } from "@/theme/semanticColors";
import EventCard from "@/features/event/EventCard";
import EventStatusBadge from "@/features/event/EventStatusBadge";
import { getEventDateStatus } from "@/features/event/EventStatusBadge";

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
  const dateStatus = getEventDateStatus(date);
  const shouldShowResult = status === "withdrawn" || dateStatus.isPast;
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
    <EventCard
      eventId={id}
      title={title}
      date={date}
      venue={venue ?? ""}
      margin="8px"
      backgroundColor={
        shouldShowResult
          ? semanticColors.negative.card
          : dateStatus.isToday
            ? semanticColors.hot.card
            : "colorPalette"
      }
      headerActions={
        isEditing ? (
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
        )
      }
      headerContent={
        isEditing ? (
          <Stack gap={3} paddingTop={8}>
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
          </Stack>
        ) : undefined
      }
      actions={
        <>
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
              backgroundColor={semanticColors.negative.button}
            >
              結果
            </Button>
          ) : dateStatus.isToday ? (
            <Button
              type="button"
              margin="4px"
              backgroundColor={semanticColors.negative.button}
              onClick={() =>
                navigate(`/events/${encodeURIComponent(id)}/visit`)
              }
            >
              巡る
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/events/${encodeURIComponent(id)}`)}
              margin="4px"
              backgroundColor="blue.500"
            >
              詳細
            </Button>
          )}
        </>
      }
    >
      <EventStatusBadge date={date} status={status} />
    </EventCard>
  );
}
