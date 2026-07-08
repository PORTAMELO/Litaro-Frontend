import styles from "../styles/EmotionCard.module.css";

const EmotionCard = ({ icon : Icon, name }) => {
  return (
    <div className={styles["emotion-card"]}>
      <Icon />
      <p>{name}</p>
    </div>
  );
};

export default EmotionCard;