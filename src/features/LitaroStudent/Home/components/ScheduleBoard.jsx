import styles from "../styles/ScheduleBoard.module.css";
import ScheduleCard from "./ScheduleCard";

const ScheduleBoard = ({ schedule }) => {
  return (
    <div className={styles["schedule-board"]}>
      {schedule.map((subject, index) => (
        <ScheduleCard
          key={index}
          icon={subject.icon}
          hour={subject.hour}
          subject={subject.subject}
        />
      ))}
    </div>
  );
};

export default ScheduleBoard;