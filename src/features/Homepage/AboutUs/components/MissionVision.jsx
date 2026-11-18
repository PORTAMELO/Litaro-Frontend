import styles from "../styles/MissionVision.module.css";

// Misión y visión lado a lado con la misma altura.
const MissionVision = ({ mission, vision }) => (
  <div className={styles.grid}>
    <article className={`${styles.card} ${styles.mission}`}>
      <h3 className={styles.title}>Misión</h3>
      <p className={styles.text}>{mission}</p>
    </article>
    <article className={`${styles.card} ${styles.vision}`}>
      <h3 className={styles.title}>Visión</h3>
      <p className={styles.text}>{vision}</p>
    </article>
  </div>
);

export default MissionVision;
