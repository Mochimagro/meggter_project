import { Container } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Header } from "@/components/Header";
import CircleListCard from "@/components/CircleListCard";
import { db } from "@/db/database";

export default function CirlceList() {
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
            <CircleListCard key={circle.id} circle={circle} />
          ))
        )}
      </Container>
    </>
  );
}
