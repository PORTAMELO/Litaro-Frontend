import styles from "../styles/AchievementCard.module.css";

const AchievementCard = ({ icon: Icon, name }) => {
  return (
   
    <div className={styles["achievement-card"]}>
      <Icon />
      <p>{name}</p>
    </div>
  );
};

export default AchievementCard;