import { useState, useMemo } from "react";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import styles from "../styles/CalendarBoard.module.css";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// --------------------------------------------------
// Convierte fecha a YYYY-MM-DD
// --------------------------------------------------
function toKey(date) {
  if (!date) return "";

  // STRING
  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  // DATE
  const y = date.getFullYear();

  const m = String(date.getMonth() + 1).padStart(2, "0");

  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function formatShortDate(date) {
  const [y, m, d] = String(date).slice(0, 10).split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}


const CalendarBoard = ({ events = [], filteredEvents = [],
   year: yearProp, selectedMonth = null,
  onSelectMonth = () => {},}) => {
  // Año actual por defecto
  const year = yearProp ?? new Date().getFullYear();

  // Tooltip
  const [tooltip, setTooltip] = useState(null);

  // --------------------------------------------------
  // MAPA DE EVENTOS
  // --------------------------------------------------
  const eventMap = useMemo(() => {
    const map = Object.create(null);

    for (const ev of events) {
      const key = toKey(ev.date);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(ev);
    }

    return map;
  }, [events]);

  // --------------------------------------------------
  // FECHAS DE LOS 12 MESES
  // --------------------------------------------------
  const monthDates = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(year, m, 1)),
    [year],
  );

  // --------------------------------------------------
  // CLASE CSS PARA DÍAS CON EVENTOS
  // --------------------------------------------------
  function tileClassName({ date, view }) {
    if (view !== "month") {
      return null;
    }

    return eventMap[toKey(date)] ? styles.hasEvent : null;
  }

  // --------------------------------------------------
  // OVERLAY DE COLOR
  // --------------------------------------------------
  function tileContent({ date, view }) {
    if (view !== "month") {
      return null;
    }

    const evts = eventMap[toKey(date)];

    if (!evts) {
      return null;
    }

    const color = evts[0].color || "#FF00FF";

    return (
      <div
        className={styles.tileOverlay}
        style={{
          background: color,
        }}
      />
    );
  }

  // --------------------------------------------------
  // TOOLTIP
  // --------------------------------------------------
  function tileProperties({ date, view }) {
    if (view !== "month") {
      return {};
    }

    const key = toKey(date);

    if (!eventMap[key]) {
      return {};
    }

    return {
      onMouseEnter: (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setTooltip({
          x: rect.left + rect.width / 2,

          y: rect.top - 8,

          evts: eventMap[key],
        });
      },

      onMouseLeave: () => {
        setTooltip(null);
      },
    };
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className={styles.CalendarBoard}>
      {/* CALENDARIO */}
      <div className={styles.wrapper}>
        {/* GRID DE MESES */}
        <div className={styles.grid}>
          {monthDates.map((monthDate, idx) => (
            <div
              key={idx}
              className={`${styles.monthCard} ${
                selectedMonth === idx ? styles.monthCardSelected : ""
              }`}
              onClick={() =>
                onSelectMonth(selectedMonth === idx ? null : idx)
              }
            >
              {/* MES */}
              <p className={styles.monthName}>{MONTHS[idx]}</p>

              {/* CALENDARIO */}
              <Calendar
                activeStartDate={monthDate}
                view="month"
                locale="es-CO"
                showNavigation={false}
                showNeighboringMonth={false}
                tileClassName={tileClassName}
                tileContent={tileContent}
                tileProperties={tileProperties}
              />
            </div>
          ))}
        </div>

        {/* TOOLTIP */}
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.evts.map((ev, i) => (
              <div key={i}>
                <span className={styles.tooltipTitle}>{ev.title}</span>

                {ev.responsible && (
                  <span className={styles.tooltipCat}> · {ev.responsible}</span>
                )}
              </div>
            ))}

            <div className={styles.tooltipDate}>
              {toKey(tooltip.evts[0].date)}
            </div>
          </div>
        )}
      </div>

       {/* LISTA DE EVENTOS */}
      <div className={styles.EventPanel}>
        {/* ENCABEZADO */}
        <div className={styles.EventPanelHeader}>
          <p className={styles.EventPanelTitle}>
            {selectedMonth === null
              ? `Eventos ${year}`
              : `Eventos de ${MONTHS[selectedMonth]}`}
            <span className={styles.EventCount}>{filteredEvents.length}</span>
          </p>

          {selectedMonth !== null && (
            <button
              type="button"
              className={styles.ShowAllButton}
              onClick={() => onSelectMonth(null)}
            >
              Ver todo el año
            </button>
          )}
        </div>

        {/* LISTA CON SCROLL */}
        <div className={styles.EventList}>
          {filteredEvents.length === 0 ? (
            <p className={styles.EmptyList}>No hay eventos para este periodo</p>
          ) : (
            filteredEvents.map((event, index) => (
              <div key={index} className={styles.EventItem}>
                {/* COLOR */}
                <span
                  className={styles.EventDot}
                  style={{
                    background: event.color,
                  }}
                />

                {/* TITULO */}
                <p className={styles.EventTitle}>{event.title}</p>

                {/* FECHA */}
                <span className={styles.EventDate}>
                  {formatShortDate(event.date)}
                </span>
              </div>
            ))
          )}
        </div>
      </div> 
    </div>
  );
};

export default CalendarBoard;
