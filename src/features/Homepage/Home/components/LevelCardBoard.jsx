import styles from "../styles/LevelCardBoard.module.css";

const LevelCardBoard = ({ levels }) => {
  return (
    <div className={styles["level-card-board"]}>
      {levels.map((level, index) => {
        return (
          <div className={styles["level-card"]} key={index}>
            <div className={styles["upper-level-card"]}>
              <img src={level.image} alt="Foto correspondiente" />
            </div>

            <div className={styles["lower-level-card"]}>
              <h4 className={styles["title"]}>{level.title}</h4>
              <p className={styles["description"]}>{level.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelCardBoard;
