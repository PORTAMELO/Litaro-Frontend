import styles from "../styles/AchievementBoard.module.css";
import AchievementCard from "./AchievementCard";

const AchievementBoard = ({ achievements }) => {
  return (
    <div className={styles["achievement-board"]}>
      <p className={styles.title}>Logros académicos</p>

      <div className={styles.cards}>
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={index}
            icon={achievement.icon}
            name={achievement.name}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementBoard;