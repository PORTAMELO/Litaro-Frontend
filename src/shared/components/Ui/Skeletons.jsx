import styles from "./Skeletons.module.css";

const Block = ({ width = "100%", height = 16, round = false }) => (
  <span className={round ? `${styles.block} ${styles.round}` : styles.block} style={{ width, height }} />
);

export const LayoutSkeleton = () => (
  <div className={styles.layout} role="status" aria-label="Cargando">
    <div className={styles.nav}>
      <Block height={48} width="70%" />
      {Array.from({ length: 8 }, (_, index) => (
        <Block key={index} height={32} />
      ))}
    </div>
    <div className={styles.main}>
      <Block height={28} width="32%" />
      <Block height={16} width="52%" />
      <div className={styles.panel}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={styles.row}>
            <Block height={14} width="38%" />
            <Block height={14} width="15%" />
            <Block height={14} width="12%" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className={styles.cardPage} role="status" aria-label="Cargando">
    <div className={styles.card}>
      <Block round width={72} height={72} />
      <Block height={24} width="60%" />
      <Block height={40} />
      <Block height={40} />
      <Block height={44} />
    </div>
  </div>
);
