import styles from "../styles/EventCardBoard.module.css";
import PhotoSlot from "../../components/PhotoSlot";
import { longDate } from "../../utils/Dates";

// Eventos destacados: actividades que la institución ya realizó.
const EventCardBoard = ({ events }) => (
  <div className={styles.grid}>
    {events.map((event, index) => (
      <article key={`${index}-${event.title}`} className={styles.event}>
        <PhotoSlot className={styles.photo} src={event.image} alt={event.title} label="Foto del evento" />
        <div className={styles.body}>
          <p className={styles.date}>{longDate(event.date)}</p>
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.description}>{event.description}</p>
          {(event.label || event.grade) && (
            <p className={styles.meta}>{[event.label, event.grade].filter(Boolean).join(". ")}</p>
          )}
        </div>
      </article>
    ))}
  </div>
);

export default EventCardBoard;
