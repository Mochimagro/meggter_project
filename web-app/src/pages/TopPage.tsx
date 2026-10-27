import { Header } from "@/components/Header";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function TopPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header pageName="トップ"></Header>
    </>
  );
}
