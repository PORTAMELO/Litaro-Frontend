import { useEffect, useMemo, useState } from "react";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import EventCardBoard from "./components/EventCardBoard";
import CalendarBoard from "./components/CalendarBoard";
import WeekEventsBoard from "./components/WeekEventsBoard";
import { getEvents } from "../services/CalendarService";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);

  const year = new Date().getFullYear();


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

  const filteredEvents = useMemo(() => {
    // 1. Solo eventos del año
    const yearEvents = events.filter((event) =>
      String(event.date).startsWith(String(year)),
    );

    // 2. Si hay mes seleccionado, solo los de ese mes
    const result =
      selectedMonth === null
        ? yearEvents
        : yearEvents.filter((event) => {
            // YYYY-MM-DD
            const month = Number(String(event.date).slice(5, 7)) - 1;

            return month === selectedMonth;
          });

    return [...result].sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
  }, [events, selectedMonth, year]);      



  return (
    <section>
      <div className="section-week">
        <SectionTitle text="¿Qué hay esta semana en el INPS?" center />

        <WeekEventsBoard events={events} />
      </div>
      
      <div className="section-calendar">
        <SectionTitle text="Calendario institucional" center />

        <CalendarBoard events={events} 
        filteredEvents={filteredEvents}
        year={year}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}/>
      </div>

      <div className="section-events">
        <SectionTitle text="¡No te pierdas nada del INPS!" center />

        <EventCardBoard events={filteredEvents} />
      </div>
    </section>
  );
};

export default Calendar;
