import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import styles from "../styles/HistoryCard.module.css"

const HistoryCard = ({ imagen, text }) => {
  return (
    <div className={styles["introduction-section"]}>
      <div className={styles["image-introduction-section"]}>
        <IoIosArrowDropleftCircle className={styles["left-button-introduction-section"]} size={"3.5rem"} />
        <img src={imagen} alt="" />
        <IoIosArrowDroprightCircle className={styles["right-button-introduction-section"]} size={"3.5rem"} />
      </div>
      <div className={styles["text-introduction-section"]}>
        <p style={{ whiteSpace: "pre-line" }}>{text}</p>
      </div>
    </div>
  );
};

export default HistoryCard;
