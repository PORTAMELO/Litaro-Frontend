import { useMemo, useState } from "react";

import { useLoad } from "@/shared/hooks/useLoad";
import ui from "../styles/Public.module.css";
import LoadError from "../components/LoadError";
import SectionSkeleton from "../components/SectionSkeleton";
import CalendarBoard from "./components/CalendarBoard";
import EventCardBoard from "./components/EventCardBoard";
import WeekEventsBoard from "./components/WeekEventsBoard";
import { getEvents } from "../services/CalendarService";
import { MONTHS, parseKey } from "../utils/Dates";

const NO_EVENTS = [];

const Calendar = () => {
  const { data, error, loading, reload } = useLoad(getEvents, []);
  const events = data ?? NO_EVENTS;
  const [selectedMonth, setSelectedMonth] = useState(null);
  const year = new Date().getFullYear();

  // Eventos del año en curso, en orden de fecha.
  const yearEvents = useMemo(
    () =>
      events
        .filter((event) => parseKey(event.date)?.getFullYear() === year)
        .sort((a, b) => String(a.date).localeCompare(String(b.date))),
    [events, year],
  );

  const shownEvents = useMemo(
    () =>
      selectedMonth === null ? yearEvents : yearEvents.filter((event) => parseKey(event.date).getMonth() === selectedMonth),
    [yearEvents, selectedMonth],
  );

  if (error) {
    return (
      <section className={ui.section}>
        <div className={ui.wrap}>
          <LoadError onRetry={reload} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={ui.section} aria-labelledby="titulo-semana">
        <div className={ui.wrap}>
          <div className={ui.sectionHead}>
            <h1 id="titulo-semana" className={ui.heading}>
              ¿Qué hay esta semana en el INPS?
            </h1>
          </div>
          {loading ? <SectionSkeleton variant="cards" /> : <WeekEventsBoard events={events} />}
        </div>
      </section>

      <section className={ui.section} aria-labelledby="titulo-anual">
        <div className={ui.wrap}>
          <div className={ui.sectionHead}>
            <div>
              <h2 id="titulo-anual" className={ui.heading}>
                Calendario institucional {year}
              </h2>
              <p className={ui.hint}>Pulsa un mes para ver solo sus eventos.</p>
            </div>
          </div>
          {loading ? (
            <SectionSkeleton variant="calendar" />
          ) : (
            <CalendarBoard
              year={year}
              yearEvents={yearEvents}
              shownEvents={shownEvents}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
            />
          )}
        </div>
      </section>

      <section className={ui.section} aria-labelledby="titulo-detalle">
        <div className={ui.wrap}>
          <div className={ui.sectionHead}>
            <div>
              <h2 id="titulo-detalle" className={ui.heading}>
                ¡No te pierdas nada del INPS!
              </h2>
              <p className={ui.hint}>
                {selectedMonth === null ? `Todos los eventos de ${year}.` : `Eventos de ${MONTHS[selectedMonth]} de ${year}.`}
              </p>
            </div>
          </div>
          {loading ? <SectionSkeleton variant="cards" /> : <EventCardBoard events={shownEvents} />}
        </div>
      </section>
    </>
  );
};

export default Calendar;
