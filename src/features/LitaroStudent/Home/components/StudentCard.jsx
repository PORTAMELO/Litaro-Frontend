import styles from "../styles/StudentCard.module.css";

const StudentCard = ({ image, grade, birthday, name }) => {
  return (
    <div className={styles["student-card"]}>
      <div className={styles["student-image"]}>
        <img src={image} alt="Estudiante" />
      </div>

      <div className={styles["student-info"]}>
        <p>{name}</p>
        <p>{grade}</p>
        <p>{birthday}</p>
      </div>
    </div>
  );
};

export default StudentCard;