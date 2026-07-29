import styles from "../styles/EmotionBoard.module.css";
import EmotionCard from "./EmotionCard";

const EmotionBoard = ({ emotions }) => {
  return (
    <div className={styles["emotion-board"]}>
      <p className={styles.title}>Estado emocional</p>

      <div className={styles.cards}>
        {emotions.map((emotion, index) => (
          <EmotionCard
            key={index}
            icon={emotion.icon}
            name={emotion.name}
          />
        ))}
      </div>
    </div>
  );
};

export default EmotionBoard;