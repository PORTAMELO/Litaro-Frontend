import styles from "../styles/ScheduleCard.module.css";

const ScheduleCard = ({ icon: Icon, hour, subject }) => {
  return (
    <div className={styles["schedule-card"]}>
      <div className={styles["subject-image"]}>
        <Icon />
      </div>

      <p>{hour}</p>

      <h3>{subject}</h3>
    </div>
  );
};

export default ScheduleCard;