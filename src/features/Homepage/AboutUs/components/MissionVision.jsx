import styles from "../styles/MissionVision.module.css";

const MissionVission = ({ mision, vision }) => {
  return (
    <div className={styles["mission-vision"]}>
      <div className={styles["mission"]}>
        <h1>Misión</h1>
        <p>{mision}</p>
      </div>
      <div className={styles["vision"]}>
        <h1>Visión</h1>
        <p>{vision}</p>
      </div>
    </div>
  );
};

export default MissionVission;
