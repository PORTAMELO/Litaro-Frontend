import styles from "../styles/IntroductionCard.module.css";

const IntroductionCard = ({ text, image }) => {
  return (
    <div className={styles["introduction-card"]}>
      <p>{text}</p>
      <img src={image} alt="" />
    </div>
  );
};

export default IntroductionCard;
