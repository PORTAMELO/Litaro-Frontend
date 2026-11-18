import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import ui from "../../styles/Public.module.css";
import styles from "../styles/LocationCardBoard.module.css";
import PhotoSlot from "../../components/PhotoSlot";

// Solo se acepta la URL de "Insertar mapa" de Google Maps (https://www.google.com/maps/embed?pb=…).
// Cualquier otro valor no llega al iframe: dentro de él se abriría una página de Litaro
// y la portada se cargaría en bucle.
const EMBED_PREFIX = "https://www.google.com/maps/embed?pb=";

const embedUrl = (value) => {
  const url = String(value ?? "").trim();
  return url.startsWith(EMBED_PREFIX) ? url : null;
};

// Una sede a la vez con flechas: el colegio tiene 9 sedes y una lista achicaría el mapa.
const LocationCardBoard = ({ locations }) => {
  const [index, setIndex] = useState(0);

  if (!locations?.length) return null;

  const total = locations.length;
  const current = Math.min(index, total - 1);
  const location = locations[current];
  const map = embedUrl(location.map);
  const move = (step) => setIndex((current + step + total) % total);

  return (
    <div className={styles.campus}>
      <article className={styles.card} aria-live="polite">
        <PhotoSlot className={styles.photo} src={location.image} alt={location.title} label="Foto de la sede" />

        <div>
          <h3 className={styles.name}>{location.title}</h3>
          <p className={location.description ? styles.description : `${styles.description} ${ui.pending}`}>
            {location.description || "Descripción pendiente."}
          </p>
        </div>

        <div className={styles.nav}>
          <button type="button" className={ui.iconButton} aria-label="Sede anterior" onClick={() => move(-1)}>
            <MdChevronLeft aria-hidden="true" />
          </button>
          <span className={styles.count}>
            Sede {current + 1} de {total}
          </span>
          <button type="button" className={ui.iconButton} aria-label="Sede siguiente" onClick={() => move(1)}>
            <MdChevronRight aria-hidden="true" />
          </button>
        </div>
      </article>

      <div className={styles.map}>
        {map ? (
          <iframe
            key={map}
            src={map}
            title={`Mapa de ${location.title}`}
            className={styles.frame}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={styles.unavailable}>
            <strong className={styles.unavailableName}>{location.title}</strong>
            <span>El mapa de esta sede no está disponible.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCardBoard;
