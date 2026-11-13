import styles from "../styles/SectionSkeleton.module.css";

const Block = ({ className = "" }) => <span className={`${styles.block} ${className}`} />;

const Intro = () => (
  <div className={styles.intro}>
    <div className={styles.lines}>
      <Block className={styles.line} />
      <Block className={styles.line} />
      <Block className={styles.line} />
      <Block className={styles.lineShort} />
    </div>
    <Block className={styles.image} />
  </div>
);

const Banner = () => (
  <div className={styles.banner}>
    {Array.from({ length: 4 }, (_, index) => (
      <Block key={index} className={styles.pill} />
    ))}
  </div>
);

const Cards = () => (
  <div className={styles.cards}>
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className={styles.card}>
        <Block className={styles.cardImage} />
        <Block className={styles.line} />
        <Block className={styles.lineShort} />
      </div>
    ))}
  </div>
);

const CalendarGrid = () => (
  <div className={styles.calendar}>
    {Array.from({ length: 12 }, (_, index) => (
      <Block key={index} className={styles.month} />
    ))}
  </div>
);

const variants = {
  intro: Intro,
  banner: Banner,
  cards: Cards,
  calendar: CalendarGrid,
};

const SectionSkeleton = ({ variant }) => {
  const Variant = variants[variant] ?? Intro;

  return (
    <div role="status" aria-label="Cargando">
      <Variant />
    </div>
  );
};

export default SectionSkeleton;
