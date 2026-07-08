import styles from "../styles/AdministracionSection.module.css";
import AdministracionCard from "./AdministracionCard";

const AdministracionSection = ({ title, cards }) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <AdministracionCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default AdministracionSection;
