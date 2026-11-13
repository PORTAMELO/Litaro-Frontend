import styles from "../styles/SectionSkeleton.module.css";

const LoadError = ({ onRetry }) => (
  <div className={styles.error} role="alert">
    <p className={styles.errorText}>No fue posible cargar el contenido.</p>
    <button type="button" className={styles.retry} onClick={onRetry}>
      Reintentar
    </button>
  </div>
);

export default LoadError;
