import styles from "../styles/IntroductionCard.module.css";

const IntroductionCard = ({ text, image }) => {
  return (
    <div className={styles["introduction-card"]}>
      <div className={styles["text-introduction-card"]}>
        <p style={{ whiteSpace: "pre-line" }}>{text}</p>
      </div>
      <div className={styles["image-introduction-card"]}>
        <img src={image} alt="" />
      </div>
    </div>
  );
};

export default IntroductionCard;
