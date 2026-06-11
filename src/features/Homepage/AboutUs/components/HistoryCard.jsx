import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import styles from "../styles/HistoryCard.module.css";

const HistoryCard = ({ imagen, text }) => {
  return (
    <div className={styles["introduction-section"]}>
      <p style={{ whiteSpace: "pre-line" }}>{text}</p>
      <div className={styles["introduction-carousel"]}>
        <IoIosArrowDropleftCircle
          className={styles["previous-image"]}
          size={"3.5rem"}
        />
        <img src={imagen} alt="" />
        <IoIosArrowDroprightCircle
          className={styles["next-image"]}
          size={"3.5rem"}
        />
      </div>
    </div>
  );
};

export default HistoryCard;
