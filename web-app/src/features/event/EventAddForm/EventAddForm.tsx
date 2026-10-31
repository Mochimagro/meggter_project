// 新しいイベントを登録するフォームを表示する。
import { Button, Field, Input, Text, VStack } from "@chakra-ui/react";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAddEvent } from "@/hooks/useAddEvent";

export default function EventAddForm() {
  const addEvent = useAddEvent();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [transportationExpenses, setTransportationExpenses] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }
    if (!eventName.trim() || !date) {
      setSubmitError("イベント名と開催日は必須です。");
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await addEvent({
        name: eventName,
        eventDate: date,
        venue: place,
        entranceFee: entranceFee === "" ? null : Number(entranceFee),
        transportationExpenses:
          transportationExpenses === "" ? null : Number(transportationExpenses),
      });
      navigate("/events");
    } catch (error) {
      console.error("イベントの保存に失敗しました。", error);
      setSubmitError(
        "イベントを保存できませんでした。入力内容を確認して再度お試しください。",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack maxW="4xl" width="full" gap={4}>
        <Field.Root required>
          <Field.Label>
            イベント名<Text color="red">*</Text>
          </Field.Label>
          <Input
            placeholder="イベント名を入力してください"
            required
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          />
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            開催日<Text color="red">*</Text>
          </Field.Label>
          <Input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>会場・開催地</Field.Label>
          <Input
            placeholder="場所を入力してください"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
          />
        </Field.Root>
        <Field.Root flex={1}>
          <Field.Label>参加費</Field.Label>
          <Input
            type="number"
            placeholder="チケット料金・入場料など入力してください"
            value={entranceFee}
            onChange={(event) => setEntranceFee(event.target.value)}
            min="0"
            step="1"
          />
        </Field.Root>
        <Field.Root flex={1}>
          <Field.Label>交通費</Field.Label>
          <Input
            type="number"
            placeholder="往復の交通費を入力してください"
            value={transportationExpenses}
            onChange={(event) => setTransportationExpenses(event.target.value)}
            min="0"
            step="1"
          />
        </Field.Root>
        {submitError && (
          <Text role="alert" color="red.600">
            {submitError}
          </Text>
        )}
        <Button
          type="submit"
          position="fixed"
          right={6}
          bottom={6}
          zIndex="tooltip"
          borderRadius="full"
          overflow="hidden"
          justifyContent="flex-start"
          backgroundColor="orange.500"
          color="white"
          boxShadow="lg"
          fontSize={16}
          opacity={isSubmitting ? 0.5 : 1}
          disabled={isSubmitting}
        >
          {isSubmitting ? "追加中..." : "イベントを追加"}
        </Button>
      </VStack>
    </form>
  );
}
