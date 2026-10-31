import { Container } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Header } from "@/components/Header";
import { db } from "@/db/database";
import CircleCard from "@/features/circle/CircleCard";
import CircleDetailLink from "@/features/circle/CircleDetailLink/CircleDetailLink";
import CircleEditForm from "@/features/circle/CircleEditForm/CircleEditForm";

export default function CircleList() {
  const circles = useLiveQuery(() =>
    db.circles.orderBy("circleName").toArray(),
  );

  return (
    <>
      <Header pageName="サークル一覧" />
      <Container as="main" py={8}>
        {circles === undefined ? (
          <p>読み込み中…</p>
        ) : circles.length === 0 ? (
          <p>サークルはまだ登録されていません。</p>
        ) : (
          circles.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              actions={<CircleDetailLink circleId={circle.id} />}
            >
              <CircleEditForm circle={circle} />
            </CircleCard>
          ))
        )}
      </Container>
    </>
  );
}
