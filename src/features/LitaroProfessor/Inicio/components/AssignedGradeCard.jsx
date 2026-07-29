import styles from "../styles/AssignedGradeCard.module.css";
import { PiStudentFill } from "react-icons/pi";

const AssignedGradeCard = ({ grade, subjects }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <PiStudentFill />
        </div>

        <div>
          <h3>{grade}</h3>
          <p>{subjects.length} materias</p>
        </div>
      </div>

      <div className={styles.subjects}>
        {subjects.map((subject, index) => (
          <div className={styles.subject} key={index}>
            <span className={styles.name}>{subject.name}</span>

            <span className={styles.classroom}>{subject.classroom}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedGradeCard;
