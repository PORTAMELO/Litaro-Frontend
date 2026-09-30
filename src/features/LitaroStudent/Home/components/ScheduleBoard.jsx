import styles from "../styles/ScheduleBoard.module.css";
import ScheduleCard from "./ScheduleCard";

const ScheduleBoard = ({ schedule }) => {
  return (
    <div className={styles["schedule-board"]}>
      <p className={styles.title}>Horario de clases</p>

      <div className={styles.cards}>
        {schedule.map((subject, index) => (
          <ScheduleCard
            key={index}
            icon={subject.icon}
            hour={subject.hour}
            subject={subject.subject}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleBoard;