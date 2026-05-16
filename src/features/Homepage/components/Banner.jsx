import styles from "../styles/Banner.module.css";

const Banner = ({ labels }) => {
  return (
    <div className={styles["banner"]}>
      {labels.map((label, index) => {
        return (
          <div className={styles["label"]} key={index}>
            <p className={styles["title"]}>{label.title}</p>
            {label.subtitle ? (
              <p className={styles["subtitle"]}>{label.subtitle}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Banner;
