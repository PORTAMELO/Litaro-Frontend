import { events } from "./CalendarData.js";
import SectionTitle from "../components/SectionTitle";
import EventCardBoard from "./components/EventCardBoard";
import CalendarBoard from "./components/CalendarBoard";

const Calendar = () => {
  return (
    <section>
      <div className="section-calendar">
        <SectionTitle text="Calendario" center={true} />
        <CalendarBoard events={events} />
      </div>
      <div className="section-events">
        <SectionTitle text="Eventos" center={true} />
        <EventCardBoard events={events}></EventCardBoard>
      </div>
    </section>
  );
};

export default Calendar;
