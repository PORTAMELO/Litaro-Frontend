import styles from "../styles/AdministracionCard.module.css";

import {
  FaPlusCircle,
  FaClipboardList,
  FaSyncAlt,
  FaTrashAlt,
} from "react-icons/fa";

const AdministracionCard = ({ title, records, icon, color }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{title}</h3>

        <p>{records} Registros</p>

        <div className={styles.actions} style={{ color }}>
          <FaPlusCircle />

          <FaClipboardList />

          <FaSyncAlt />

          <FaTrashAlt />
        </div>
      </div>

      <div className={styles.icon} style={{ color }}>
        {icon}
      </div>
    </div>
  );
};

export default AdministracionCard;
