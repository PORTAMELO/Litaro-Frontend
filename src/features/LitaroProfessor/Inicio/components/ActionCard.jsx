import styles from "../styles/ActionCard.module.css";

const ActionCard = ({ title, description, color, icon }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      <div className={styles.content}>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <div className={styles.icon}>{icon}</div>
      </div>

      <button className={styles.button}>Ingresar</button>
    </div>
  );
};

export default ActionCard;
