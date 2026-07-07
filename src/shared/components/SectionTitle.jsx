import styles from "../styles/SectionTitle.module.css";

const SectionTitle = ({ text, center }) => {
  return (
    <div style={{ textAlign: center === true ? "center" : "start" }}>
      <h2 className={styles["title"]}>{text}</h2>
    </div>
  );
};

export default SectionTitle;
