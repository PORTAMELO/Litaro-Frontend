import styles from "../styles/AdmissionGuide.module.css";

const AdmissionGuide = ({ steps }) => {
  return (
    <section className={styles["guide"]}>
      <div className={styles["guide-line"]} />

      {steps.map((step, index) => (
        <article
          key={index}
          className={`${styles["guide-item"]} ${
            index % 2 === 0
              ? styles["guide-item-left"]
              : styles["guide-item-right"]
          }`}
        >
          <div className={styles["guide-content"]}>
            <div className={styles["guide-number"]}>
              {index + 1}
            </div>

            <div className={styles["guide-card"]}>
              <h3 className={styles["guide-card-title"]}>
                Paso {index + 1}
              </h3>

              <p className={styles["guide-card-text"]}>
                {step}
              </p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default AdmissionGuide;