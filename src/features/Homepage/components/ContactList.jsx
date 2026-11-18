import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail, MdSchedule } from "react-icons/md";

import styles from "../styles/ContactList.module.css";

const ITEMS = [
  { name: "location", label: "Dirección", icon: FaLocationDot },
  { name: "phone", label: "Teléfono", icon: FaPhone },
  { name: "email", label: "Correo", icon: MdEmail },
  { name: "schedule", label: "Horario de atención", icon: MdSchedule },
];

// Datos de contacto del colegio (Contenido Web, "Información institucional").
// `inverse` es para fondos oscuros, como el pie de página.
const ContactList = ({ information, inverse = false, className = "" }) => (
  <dl className={`${styles.list} ${inverse ? styles.inverse : ""} ${className}`}>
    {ITEMS.filter((item) => information[item.name]).map(({ name, label, icon: Icon }) => (
      <div key={name} className={styles.item}>
        <Icon className={styles.icon} aria-hidden="true" />
        <div>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{information[name]}</dd>
        </div>
      </div>
    ))}
  </dl>
);

export default ContactList;
