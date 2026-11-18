import styles from "../styles/AdmissionGuide.module.css";

// Pasos del proceso de admisión, numerados y unidos por una línea; el último va en verde.
const AdmissionGuide = ({ steps }) => (
  <ol className={styles.steps} aria-label="Pasos del proceso de admisión">
    {steps.map((step, index) => (
      <li key={`${index}-${step.description}`} className={styles.step}>
        <p className={styles.text}>{step.description}</p>
      </li>
    ))}
  </ol>
);

export default AdmissionGuide;
