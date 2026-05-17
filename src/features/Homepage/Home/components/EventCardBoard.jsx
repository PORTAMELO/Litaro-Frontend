import styles from "../styles/EventCardBoard.module.css";

const EventCardBoard = ({ events }) => {
  return (
    <div className={styles["event-card-board"]}>
      {events.map((event, index) => {
        return (
          <div className={styles["event-card"]} key={index}>
            <div className={styles["upper-event-card"]}>
              <img src={event.image} alt={event.title} />
              <p className={styles["label"]}>{event.label}</p>
            </div>

            <div className={styles["lower-event-card"]}>
              <div className={styles["info"]}>
                <p className={styles["date"]}>{event.date}</p>
                <p className={styles["grade"]}>{event.grade}</p>
              </div>
              <h2 className={styles["title"]}>{event.title}</h2>
              <p className={styles["description"]}>{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventCardBoard;
