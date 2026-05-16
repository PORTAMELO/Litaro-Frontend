import styles from "../styles/EventCardBoard.module.css";
import { FaCalendarCheck } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";

const EventCardBoard = ({ events }) => {
  return (
    <div className={styles["event-card-board"]}>
      {events.map((event, index) => {
        return (
          <div className={styles["event-card"]} key={index}>
            <div
              className={styles["upper-event-card"]}
              style={{ background: event.color }}
            >
              <div className={styles["dot-label"]}>
                <div
                  className={styles["dot"]}
                  style={{ background: event.color }}
                ></div>
                <span className={styles["label"]}>{event.category}</span>
              </div>
              <div className={styles["title-date"]}>
                <h1>{event.title}</h1>
                <p>{event.date}</p>
              </div>
            </div>
            <div className={styles["lower-event-card"]}>
              <div className={styles["event-labels"]}>
                <div>
                  <FaCalendarCheck className={styles["icon"]} />
                  <span className={styles["float-span"]}>{event.duration}</span>
                </div>
                <div>
                  <MdPlace className={styles["icon"]} />
                  <span className={styles["float-span"]}>{event.place}</span>
                </div>
                <div className={styles["info"]}>
                  <BsFillPeopleFill className={styles["icon"]} />
                  <span className={styles["float-span"]}>
                    {event.asistants}
                  </span>
                </div>
              </div>
              <hr />
              <p className={styles["description"]}>{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventCardBoard;
