import { useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import ui from "../../styles/Public.module.css";
import styles from "../styles/CalendarBoard.module.css";
import EventDot from "./EventDot";
import { MONTHS, SHORT_MONTHS, capitalize, eventCount, parseKey, startOfToday, toKey } from "../../utils/Dates";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const MonthCard = ({ year, month, eventsByDay, count, todayKey, selected, current, onSelect }) => {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const label = count ? eventCount(count) : "";

  return (
    <button
      type="button"
      className={current ? `${styles.month} ${styles.current}` : styles.month}
      aria-pressed={selected}
      aria-label={`${MONTHS[month]}, ${label || "sin eventos"}`}
      onClick={onSelect}
    >
      <span className={styles.monthHead}>
        <span className={styles.monthName}>{MONTHS[month]}</span>
        <span className={styles.monthCount}>{label}</span>
      </span>

      <span className={styles.mini} aria-hidden="true">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`} className={styles.weekday}>
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: total }, (_, index) => {
          const key = toKey(new Date(year, month, index + 1));
          const dayEvents = eventsByDay.get(key);
          const classes = [styles.day, dayEvents ? styles.hasEvent : "", key === todayKey ? styles.today : ""];

          return (
            <span
              key={key}
              className={classes.filter(Boolean).join(" ")}
              title={dayEvents ? dayEvents.map((event) => event.title).join(" · ") : undefined}
            >
              {index + 1}
            </span>
          );
        })}
      </span>
    </button>
  );
};

// Vista anual: 12 meses con los días que tienen eventos y, al lado, la lista del año o
// del mes elegido. Por debajo de 900 px los meses pasan a un carrusel de uno en uno.
const CalendarBoard = ({ year, yearEvents, shownEvents, selectedMonth, onSelectMonth }) => {
  const today = startOfToday();
  const todayKey = toKey(today);
  const [carouselMonth, setCarouselMonth] = useState(today.getFullYear() === year ? today.getMonth() : 0);

  const eventsByDay = useMemo(() => {
    const map = new Map();

    yearEvents.forEach((event) => {
      const key = toKey(event.date);
      map.set(key, [...(map.get(key) ?? []), event]);
    });

    return map;
  }, [yearEvents]);

  const countByMonth = useMemo(() => {
    const counts = Array(12).fill(0);
    yearEvents.forEach((event) => {
      counts[parseKey(event.date).getMonth()] += 1;
    });
    return counts;
  }, [yearEvents]);

  return (
    <div className={styles.layout}>
      <div>
        <div className={styles.carouselNav}>
          <button
            type="button"
            className={ui.iconButton}
            aria-label="Mes anterior"
            disabled={carouselMonth === 0}
            onClick={() => setCarouselMonth(carouselMonth - 1)}
          >
            <MdChevronLeft aria-hidden="true" />
          </button>
          <strong className={styles.carouselLabel} aria-live="polite">
            {capitalize(MONTHS[carouselMonth])} {year}
            <span className={styles.carouselCount}>
              {countByMonth[carouselMonth] ? eventCount(countByMonth[carouselMonth]) : "Sin eventos"}
            </span>
          </strong>
          <button
            type="button"
            className={ui.iconButton}
            aria-label="Mes siguiente"
            disabled={carouselMonth === 11}
            onClick={() => setCarouselMonth(carouselMonth + 1)}
          >
            <MdChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className={styles.grid}>
          {MONTHS.map((name, month) => (
            <MonthCard
              key={name}
              year={year}
              month={month}
              eventsByDay={eventsByDay}
              count={countByMonth[month]}
              todayKey={todayKey}
              selected={selectedMonth === month}
              current={carouselMonth === month}
              onSelect={() => onSelectMonth(selectedMonth === month ? null : month)}
            />
          ))}
        </div>
      </div>

      <aside className={styles.panel} aria-labelledby="titulo-panel">
        <div className={styles.panelHead}>
          <h3 id="titulo-panel" className={styles.panelTitle}>
            {selectedMonth === null ? `Eventos ${year}` : `Eventos de ${MONTHS[selectedMonth]}`}
          </h3>
          {selectedMonth !== null && (
            <button type="button" className={ui.linkButton} onClick={() => onSelectMonth(null)}>
              Ver todo el año
            </button>
          )}
        </div>

        {shownEvents.length === 0 ? (
          <p className={styles.empty}>No hay eventos en este periodo.</p>
        ) : (
          <ol className={styles.list}>
            {shownEvents.map((event, index) => {
              const date = parseKey(event.date);

              return (
                <li key={`${index}-${event.title}`} className={styles.item}>
                  <p className={styles.itemDate}>
                    <b className={styles.itemDay}>{date.getDate()}</b>
                    {SHORT_MONTHS[date.getMonth()]}
                  </p>
                  <span className={styles.itemTitle}>
                    <EventDot color={event.color} />
                    {event.title}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </aside>
    </div>
  );
};

export default CalendarBoard;
