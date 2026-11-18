import styles from "../styles/EventCardBoard.module.css";
import EventDot from "./EventDot";
import { SHORT_MONTHS, parseKey, startOfToday } from "../../utils/Dates";

const Detail = ({ label, value }) =>
  value ? (
    <div className={styles.detail}>
      <dt className={styles.detailLabel}>{label}:</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  ) : null;

// Detalle de los eventos del año (o del mes elegido). Los que ya pasaron se marcan.
const EventCardBoard = ({ events }) => {
  if (events.length === 0) return <p className={styles.empty}>No hay eventos en este periodo.</p>;

  const today = startOfToday();

  return (
    <div className={styles.list}>
      {events.map((event, index) => {
        const date = parseKey(event.date);
        const past = date < today;

        return (
          <article key={`${index}-${event.title}`} className={past ? `${styles.event} ${styles.past}` : styles.event}>
            <p className={styles.date}>
              <span className={styles.day}>{date.getDate()}</span>
              <span className={styles.month}>
                {SHORT_MONTHS[date.getMonth()]} {date.getFullYear()}
              </span>
            </p>
            <div>
              <h3 className={styles.title}>
                <EventDot color={event.color} />
                {event.title}
                {past && <span className={styles.badge}>Ya se realizó</span>}
              </h3>
              {event.description && <p className={styles.description}>{event.description}</p>}
              <dl className={styles.details}>
                <Detail label="Horario" value={event.schedule} />
                <Detail label="Lugar" value={event.place} />
                <Detail label="Dirigido a" value={event.asistants} />
                <Detail label="Responsable" value={event.responsible} />
              </dl>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default EventCardBoard;
