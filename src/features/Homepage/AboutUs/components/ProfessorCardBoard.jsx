import styles from "../styles/ProfessorCardBoard.module.css";

const ProfessorCardBoard = ({ professors }) => {
  return (
    <div className={styles["professor-card-board"]}>
      {professors.map((professor, index) => {
        return (
          <div className={styles["professor-card"]} key={index}>
            <div className={styles["upper-professor-card"]}>
              <img src={professor.image} alt={professor.name} />
              <h2 className={styles["name"]}>{professor.name}</h2>
            </div>

            <div className={styles["lower-professor-card"]}>
              <p className={styles["role"]}>{professor.role}</p>
              <p className={styles["description"]}>{professor.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfessorCardBoard;
