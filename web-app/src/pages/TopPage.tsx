import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function TopPage() {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate("/events")}>EventList</Button>
      <Button onClick={() => navigate("/events/edit")}>EventEdit</Button>
      <Button onClick={() => navigate("/events/info")}>EventInfo</Button>
    </>
  );
}
