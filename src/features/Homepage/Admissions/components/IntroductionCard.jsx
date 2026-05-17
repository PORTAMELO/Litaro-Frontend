import styles from "../styles/IntroductionCard.module.css";

const IntroductionCard = ({ introduction, image }) => {
  return (
    <div className={styles["introduction-card"]}>
      <p>{introduction}</p>
      <img src={image} alt="Admisiones" />
    </div>
  );
};

export default IntroductionCard;
