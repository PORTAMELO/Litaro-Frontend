import { Link } from "react-router-dom";
import styles from "../styles/MobileNavigation.module.css";
import { FaCalendar, FaClipboardList, FaHome } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

const MobileNavigation = () => {
  return (
    <footer className={styles["mobile-navigation"]}>
      <p>
        <FaHome className={styles["icon"]} />
        <Link to="/Homepage/Inicio">Inicio</Link>
      </p>
      <p>
        <FaPeopleGroup className={styles["icon"]} />
        <Link to="/Homepage/Nosotros">Nosotros</Link>
      </p>
      <p>
        <FaCalendar className={styles["icon"]} />
        <Link to="/Homepage/Calendario">Calendario</Link>
      </p>
      <p>
        <FaClipboardList className={styles["icon"]} />
        <Link to="/Homepage/Admisiones">Admisiones</Link>
      </p>
    </footer>
  );
};

export default MobileNavigation;
