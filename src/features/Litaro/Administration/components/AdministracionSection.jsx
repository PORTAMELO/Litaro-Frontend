import styles from "../styles/AdministracionSection.module.css";
import AdministracionCard from "./AdministracionCard";

const AdministracionSection = ({ title, cards, onManage }) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <AdministracionCard key={index} {...card} onManage={() => onManage(card)} />
        ))}
      </div>
    </section>
  );
};

export default AdministracionSection;
