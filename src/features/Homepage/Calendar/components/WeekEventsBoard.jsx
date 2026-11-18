import { useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import ui from "../../styles/Public.module.css";
import styles from "../styles/WeekEventsBoard.module.css";
import { MONTHS, addDays, mondayOf, parseKey, startOfToday, toKey } from "../../utils/Dates";

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const dayMonth = (date) => `${date.getDate()} de ${MONTHS[date.getMonth()]}`;

// Semana de lunes a sábado, navegable con flechas, por fecha o volviendo a la actual.
const WeekEventsBoard = ({ events }) => {
  const [weekStart, setWeekStart] = useState(() => mondayOf(startOfToday()));

  const todayKey = toKey(startOfToday());
  const isCurrentWeek = toKey(weekStart) === toKey(mondayOf(startOfToday()));

  const days = useMemo(
    () =>
      DAY_NAMES.map((name, index) => {
        const date = addDays(weekStart, index);
        const key = toKey(date);
        const dayEvents = events
          .filter((event) => toKey(String(event.date ?? "")) === key)
          .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

        return { name, date, key, events: dayEvents };
      }),
    [events, weekStart],
  );

  const weekEnd = days[days.length - 1].date;
  const label = `${dayMonth(weekStart)} al ${dayMonth(weekEnd)} de ${weekEnd.getFullYear()}`;

  const pickDate = (event) => {
    const date = parseKey(event.target.value);

    if (date) setWeekStart(mondayOf(date));
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.navigation}>
          <button
            type="button"
            className={ui.iconButton}
            aria-label="Semana anterior"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <MdChevronLeft aria-hidden="true" />
          </button>
          <strong className={styles.label} aria-live="polite">
            {label}
          </strong>
          <button
            type="button"
            className={ui.iconButton}
            aria-label="Semana siguiente"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <MdChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className={styles.tools}>
          <label className={styles.picker}>
            Ir a la semana del
            <input className={styles.dateInput} type="date" value={toKey(weekStart)} onChange={pickDate} />
          </label>
          <button
            type="button"
            className={`${ui.button} ${ui.tertiary}`}
            disabled={isCurrentWeek}
            onClick={() => setWeekStart(mondayOf(startOfToday()))}
          >
            Semana actual
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {days.map((day) => (
          <div key={day.key} className={day.key === todayKey ? `${styles.day} ${styles.today}` : styles.day}>
            <div className={styles.dayHead}>
              {day.name}
              <b className={styles.dayNumber}>{day.date.getDate()}</b>
            </div>

            {day.events.length === 0 ? (
              <p className={styles.empty}>Sin eventos</p>
            ) : (
              day.events.map((event, index) => (
                <div key={`${index}-${event.title}`} className={styles.event}>
                  <b className={styles.eventTitle}>{event.title}</b>
                  {event.schedule}
                  {event.place && <span className={styles.eventPlace}>{event.place}</span>}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekEventsBoard;
