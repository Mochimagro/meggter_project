import { BrowserRouter, Route, Routes } from "react-router";
import TopPage from "./pages/TopPage";
import EventList from "./pages/EventList";
import EventEdit from "./pages/EventEdit";
import EventInfo from "./pages/EventInfo";
import CirlceList from "./pages/CircleList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/edit" element={<EventEdit />} />
        <Route path="/events/:eventId" element={<EventInfo />} />
        <Route path="/circles" element={<CirlceList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
