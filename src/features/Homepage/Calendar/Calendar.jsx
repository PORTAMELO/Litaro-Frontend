import { useEffect, useState } from "react";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import EventCardBoard from "./components/EventCardBoard";
import CalendarBoard from "./components/CalendarBoard";

import { getEvents } from "../services/CalendarService";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const events = await getEvents();

        setEvents(events);
      } catch (error) {
        console.error(error);
      }
    };

    loadContent();
  }, []);

  return (
    <section>
      <div className="section-calendar">
        <SectionTitle text="Calendario" center />

        <CalendarBoard events={events} />
      </div>

      <div className="section-events">
        <SectionTitle text="Eventos" center />

        <EventCardBoard events={events} />
      </div>
    </section>
  );
};

export default Calendar;
