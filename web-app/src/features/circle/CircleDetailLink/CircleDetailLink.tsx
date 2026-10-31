// サークル詳細画面へのリンクを表示する。
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

type CircleDetailLinkProps = {
  circleId: string;
};

export default function CircleDetailLink({
  circleId,
}: CircleDetailLinkProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      onClick={() => navigate(`/circles/${encodeURIComponent(circleId)}`)}
    >
      詳細
    </Button>
  );
}
