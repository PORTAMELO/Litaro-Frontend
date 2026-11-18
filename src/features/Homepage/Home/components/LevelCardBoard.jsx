import styles from "../styles/LevelCardBoard.module.css";
import PhotoSlot from "../../components/PhotoSlot";

const LevelCardBoard = ({ levels }) => (
  <div className={styles.levels}>
    {levels.map((level, index) => (
      <article key={`${index}-${level.title}`} className={styles.level}>
        <PhotoSlot className={styles.photo} src={level.image} alt={level.title} label="Foto del nivel" />
        <div>
          <h3 className={styles.title}>{level.title}</h3>
          <p className={styles.description}>{level.description}</p>
        </div>
      </article>
    ))}
  </div>
);

export default LevelCardBoard;
