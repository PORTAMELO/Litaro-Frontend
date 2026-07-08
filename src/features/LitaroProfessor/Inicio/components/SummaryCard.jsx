import styles from "../styles/SummaryCard.module.css";

const SummaryCard = ({ title, value, subtitle, color, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{title}</h3>

        <p className={styles.value} style={{ color }}>
          {value}
        </p>

        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div
        className={styles.icon}
        style={{
          backgroundColor: color,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default SummaryCard;
