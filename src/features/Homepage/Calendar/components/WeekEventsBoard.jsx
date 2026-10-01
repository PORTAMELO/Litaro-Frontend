import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaClock, FaUserTie } from "react-icons/fa";
import { MdPlace } from "react-icons/md";

import styles from "../styles/WeekEventsBoard.module.css";

// Ajuste de fecha
const toDateKey = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date.slice(0, 10);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Usa el formato YYYY-MM-DD
const parseDateKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (date, amount) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
};

// Lunes de la semana 0 es el domingo
const getMonday = (date) => {
  const day = date.getDay();
  return addDays(date, day === 0 ? -5 : 1 - day);
};

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];


const formatDayMonth = (date) =>
  date.toLocaleDateString("es-CO", { day: "numeric", month: "long" });

const WeekEventsBoard = ({ events = [] }) => {
  // Lunes actual de la semana
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));

  const todayKey = toDateKey(new Date());
  const currentWeekKey = toDateKey(getMonday(new Date()));
  const isCurrentWeek = toDateKey(weekStart) === currentWeekKey;

  // Días de la semana
  const weekDays = useMemo(
    () =>
      DAY_NAMES.map((name, index) => {
        const date = addDays(weekStart, index);

        return { name, date, key: toDateKey(date) };
      }),
    [weekStart],
  );

  // Eventos agurpados por dia
  const eventsByDay = useMemo(() => {
    const weekKeys = new Set(weekDays.map((day) => day.key));
    const map = {};

    for (const event of events) {
      const key = toDateKey(event.date);

      if (!weekKeys.has(key)) continue;

      if (!map[key]) map[key] = [];

      map[key].push(event);
    }

    // Ordenarlos por hora de inicio
    Object.values(map).forEach((list) =>
      list.sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")),
    );

    return map;
  }, [events, weekDays]);

  // navegación de las semanas
  const goToPreviousWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const goToNextWeek = () => setWeekStart((prev) => addDays(prev, 7));
  const goToCurrentWeek = () => setWeekStart(getMonday(new Date()));

  const handleDatePick = (e) => {
    if (!e.target.value) return;

    setWeekStart(getMonday(parseDateKey(e.target.value)));
  };

  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `${formatDayMonth(weekStart)} al ${formatDayMonth(weekEnd)} de ${weekEnd.getFullYear()}`;

  
  return (
    <div className={styles.weekBoard}>
      {/* BARRA SUPERIOR */}
      <div className={styles.toolbar}>
        <div className={styles.navigation}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToPreviousWeek}
            aria-label="Semana anterior"
          >
            <FaChevronLeft />
          </button>

          <h3 className={styles.weekLabel}>{weekLabel}</h3>

          <button
            type="button"
            className={styles.navButton}
            onClick={goToNextWeek}
            aria-label="Semana siguiente"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className={styles.actions}>
          <label className={styles.datePicker}>
            Ir a la semana del
            <input type="date" value={toDateKey(weekStart)} onChange={handleDatePick} />
          </label>

          <button
            type="button"
            className={styles.currentWeekButton}
            onClick={goToCurrentWeek}
            disabled={isCurrentWeek}
          >
            Semana actual
          </button>
        </div>
      </div>

      {/* DÍAS */}
      <div className={styles.daysGrid}>
        {weekDays.map((day) => {
          const dayEvents = eventsByDay[day.key] ?? [];
          const isToday = day.key === todayKey;

          return (
            <div
              key={day.key}
              className={`${styles.dayColumn} ${isToday ? styles.today : ""}`}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayName}>{day.name}</span>
                <span className={styles.dayNumber}>{day.date.getDate()}</span>
              </div>

              <div className={styles.dayBody}>
                {dayEvents.length === 0 ? (
                  <p className={styles.noEvents}>No se encuentran eventos</p>
                ) : (
                  dayEvents.map((event, index) => (
                    <article
                      key={`${day.key}-${index}`}
                      className={styles.eventCard}
                      style={{ borderLeftColor: event.color || "var(--primary-color)" }}
                    >
                      <h4 className={styles.eventTitle}>{event.title}</h4>

                      <p className={styles.eventInfo}>
                        <FaClock className={styles.icon} />
                        {event.schedule}
                      </p>

                      {event.responsible && (
                        <p className={styles.eventInfo}>
                          <FaUserTie className={styles.icon} />
                          {event.responsible}
                        </p>
                      )}

                      {event.place && (
                        <p className={styles.eventInfo}>
                          <MdPlace className={styles.icon} />
                          {event.place}
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekEventsBoard;