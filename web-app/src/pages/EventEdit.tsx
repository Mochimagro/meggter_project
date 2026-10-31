import { Container } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import EventAddForm from "@/features/event/EventAddForm";

export default function EventEdit() {
  return (
    <>
      <Header pageName="イベント追加" />
      <Container as="main" maxW="4xl" width="full" flex="1" py={6}>
        <EventAddForm />
      </Container>
    </>
  );
}
