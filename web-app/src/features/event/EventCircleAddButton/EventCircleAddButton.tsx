// イベントへの参加サークル追加を開始するボタンを表示する。
import { Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  useAddCircle,
  type CircleSelection,
} from "@/hooks/useAddCircle";
import EventCircleAddForm from "../EventCircleAddForm/EventCircleAddForm";

type EventCircleAddButtonProps = {
  eventId: string;
};

export default function EventCircleAddButton({
  eventId,
}: EventCircleAddButtonProps) {
  const addCircle = useAddCircle();
  const [isAdding, setIsAdding] = useState(false);
  const isAddingCircleRef = useRef(false);

  const handleAddCircle = async (selection: CircleSelection) => {
    if (isAddingCircleRef.current) {
      throw new Error("サークルを追加中です。");
    }

    isAddingCircleRef.current = true;
    try {
      const circleId = await addCircle(eventId, selection);
      setIsAdding(false);
      return circleId;
    } catch (error) {
      console.error("サークルの追加に失敗しました。", error);
      throw error;
    } finally {
      isAddingCircleRef.current = false;
    }
  };

  if (isAdding) {
    return (
      <EventCircleAddForm
        onAdd={handleAddCircle}
        onCancel={() => setIsAdding(false)}
      />
    );
  }

  return (
    <Button type="button" onClick={() => setIsAdding(true)}>
      サークル追加
    </Button>
  );
}
