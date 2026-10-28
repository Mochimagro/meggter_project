import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "@/db/database";
import {
  CircleAlreadyAddedError,
  type CircleSelection,
} from "@/hooks/useAddCircle";
import { normalizeExternalUrl } from "@/utils/externalUrl";

type EventAddCirclrCardProps = {
  onAdd: (selection: CircleSelection) => Promise<string>;
  onCancel: () => void;
};

const NEW_CIRCLE_OPTION = "__new_circle__";

export default function EventAddCirclrCard({
  onAdd,
  onCancel,
}: EventAddCirclrCardProps) {
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [newCircleName, setNewCircleName] = useState("");
  const [penName, setPenName] = useState("");
  const [circleURL, setCircleURL] = useState("");
  const [space, setSpace] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState("");
  const circles = useLiveQuery(
    () => db.circles.orderBy("circleName").toArray(),
    [],
  );
  const isCreatingNewCircle = selectedCircleId === NEW_CIRCLE_OPTION;
  const canSubmit = isCreatingNewCircle
    ? newCircleName.trim().length > 0 && space.trim().length > 0
    : selectedCircleId.length > 0 && space.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    const normalizedCircleURL = normalizeExternalUrl(circleURL);
    if (circleURL.trim() && !normalizedCircleURL) {
      setAddError(
        "URLはhttpまたはhttpsから始まる正しい形式で入力してください。",
      );
      return;
    }

    setIsSubmitting(true);
    setAddError("");
    try {
      await onAdd(
        isCreatingNewCircle
          ? {
              circleName: newCircleName.trim(),
              penName: penName.trim(),
              circleURL: normalizedCircleURL,
              space: space.trim(),
            }
          : { circleId: selectedCircleId, space: space.trim() },
      );
    } catch (error) {
      if (error instanceof CircleAlreadyAddedError) {
        setAddError("一つのイベントに同じサークルは登録できません。");
      } else {
        setAddError("サークルを追加できませんでした。再度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">サークルを追加</Heading>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>サークル名</Field.Label>
            <select
              aria-label="サークル名"
              value={selectedCircleId}
              onChange={(event) => {
                setSelectedCircleId(event.target.value);
                setAddError("");
              }}
            >
              <option value="">サークルを選択してください</option>
              {circles?.map((circle) => (
                <option key={circle.id} value={circle.id}>
                  {circle.circleName || "サークル名未設定"}
                </option>
              ))}
              <option value={NEW_CIRCLE_OPTION}>【新規サークル追加】</option>
            </select>
          </Field.Root>
          {isCreatingNewCircle && (
            <>
              <Field.Root required>
                <Field.Label>
                  新しいサークル名 <Text color="red.500">*</Text>
                </Field.Label>
                <Input
                  autoFocus
                  required
                  value={newCircleName}
                  onChange={(event) => setNewCircleName(event.target.value)}
                  placeholder="サークル名を入力してください"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>サークル主名（任意）</Field.Label>
                <Input
                  value={penName}
                  onChange={(event) => setPenName(event.target.value)}
                  placeholder="サークル主の名前を入力してください"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>URL（任意）</Field.Label>
                <Input
                  type="url"
                  value={circleURL}
                  onChange={(event) => setCircleURL(event.target.value)}
                  placeholder="Twitter(現X)やPixivなどのURLを記入してください"
                />
              </Field.Root>
            </>
          )}
          {selectedCircleId && (
            <Field.Root required>
              <Field.Label>
                配置場所 <Text color="red.500">*</Text>
              </Field.Label>
              <Input
                required
                value={space}
                onChange={(event) => setSpace(event.target.value)}
                placeholder="スペース番号を入力してください"
              />
            </Field.Root>
          )}

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
          disabled={!canSubmit || isSubmitting || circles === undefined}
        >
          {isSubmitting ? "追加中..." : "追加"}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
