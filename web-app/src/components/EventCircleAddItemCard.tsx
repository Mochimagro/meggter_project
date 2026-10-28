import { Button, Card, Field, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { NewWishlistItem } from "@/hooks/useAddWishlistItem";

type EventCircleAddItemCardProps = {
  onAdd: (item: NewWishlistItem) => Promise<string>;
  onCancel: () => void;
};

export default function EventCircleAddItemCard({
  onAdd,
  onCancel,
}: EventCircleAddItemCardProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState("");
  const canSubmit =
    title.trim().length > 0 &&
    price !== "" &&
    Number.isFinite(Number(price)) &&
    Number(price) >= 0;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setAddError("");
    try {
      await onAdd({ title: title.trim(), price: Number(price) });
      onCancel();
    } catch (error) {
      console.error("購入予定アイテムの追加に失敗しました。", error);
      setAddError("アイテムを追加できませんでした。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">購入予定アイテムを追加</Heading>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>
          <Field.Root required>
            <Field.Label>
              タイトル <Text color="red.500">*</Text>
            </Field.Label>
            <Input
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="アイテム名を入力してください"
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>
              価格 <Text color="red.500">*</Text>
            </Field.Label>
            <Input
              required
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="価格を入力してください"
            />
          </Field.Root>
          {addError && (
            <Text role="alert" color="red.600">
              {addError}
            </Text>
          )}
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "追加中..." : "追加"}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
