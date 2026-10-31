import { BrowserRouter, Route, Routes } from "react-router";
import TopPage from "./pages/TopPage";
import EventList from "./pages/EventList";
import EventEdit from "./pages/EventEdit";
import EventInfo from "./pages/EventInfo";
import CircleList from "./pages/CircleList";
import EventVisit from "./pages/EventVisit";
import EventResult from "./pages/EventResult";
import CircleInfo from "./pages/CircleInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/edit" element={<EventEdit />} />
        <Route path="/events/:eventId/visit" element={<EventVisit />} />
        <Route path="/events/:eventId/result" element={<EventResult />} />
        <Route path="/events/:eventId" element={<EventInfo />} />
        <Route path="/circles" element={<CircleList />} />
        <Route path="/circles/:circleId" element={<CircleInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
