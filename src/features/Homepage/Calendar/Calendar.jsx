import { useMemo, useState } from "react";

import SectionTitle from "../../../shared/components/SectionTitle.jsx";
import { useLoad } from "../../../shared/hooks/UseLoad";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import EventCardBoard from "./components/EventCardBoard";
import CalendarBoard from "./components/CalendarBoard";
import WeekEventsBoard from "./components/WeekEventsBoard";
import { getEvents } from "../services/CalendarService";

const NO_EVENTS = [];

const Calendar = () => {
  const { data, error, loading, reload } = useLoad(getEvents, []);
  const events = data ?? NO_EVENTS;

  const [selectedMonth, setSelectedMonth] = useState(null);

  const year = new Date().getFullYear();

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



  if (error) {
    return (
      <section>
        <LoadError onRetry={reload} />
      </section>
    );
  }

  return (
    <section>
      <div className="section-week">
        <SectionTitle text="¿Qué hay esta semana en el INPS?" center />

        {loading ? <SectionSkeleton variant="cards" /> : <WeekEventsBoard events={events} />}
      </div>

      <div className="section-calendar">
        <SectionTitle text="Calendario institucional" center />

        {loading ? (
          <SectionSkeleton variant="calendar" />
        ) : (
          <CalendarBoard events={events}
          filteredEvents={filteredEvents}
          year={year}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}/>
        )}
      </div>

      <div className="section-events">
        <SectionTitle text="¡No te pierdas nada del INPS!" center />

        {loading ? <SectionSkeleton variant="cards" /> : <EventCardBoard events={filteredEvents} />}
      </div>
    </section>
  );
};

export default Calendar;
