import styles from "../styles/AdministrationSection.module.css";
import AdministrationCard from "./AdministrationCard";

const AdministrationSection = ({ title, cards, onManage }) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <AdministrationCard key={index} {...card} onManage={() => onManage(card)} />
        ))}
      </div>
    </section>
  );
};

export default AdministrationSection;
