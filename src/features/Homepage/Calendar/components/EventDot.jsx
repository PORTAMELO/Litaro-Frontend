import styles from "../styles/EventDot.module.css";

const HEX = /^#[0-9a-f]{3,8}$/i;

// Color del evento elegido en Contenido Web. Sin color válido no se dibuja nada.
const EventDot = ({ color }) =>
  HEX.test(String(color ?? "")) ? <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" /> : null;

export default EventDot;
