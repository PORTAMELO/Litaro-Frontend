import styles from "../styles/AdministracionCard.module.css";
import colegio from "../../../../assets/colegio.jpeg";

import {
  FaPlusCircle,
  FaClipboardList,
  FaSyncAlt,
  FaTrashAlt,
} from "react-icons/fa";

const AdministracionCard = ({ title, records, color }) => {
  return (
    <div
      className={styles.card}
      style={{
        "--card-color": color,
        "--card-image": `url(${colegio})`,
      }}
    >
      <div className={styles.info}>
        <h3>{title}</h3>

        <p>{records} Registros</p>

        <div className={styles.actions}>
          <FaPlusCircle />
          <FaClipboardList />
          <FaSyncAlt />
          <FaTrashAlt />
        </div>
      </div>
    </div>
  );
};

export default AdministracionCard;
