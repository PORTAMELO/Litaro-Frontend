import { useReducer } from "react";
import styles from "../styles/LocationCardBoard.module.css";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

// El mapa se administra en Contenido Web. Se acepta la URL de "Insertar mapa" de
// Google o el código <iframe> completo que Google ofrece para copiar. Cualquier otro
// valor se descarta: dentro de un iframe, un texto que no es URL se abre como una
// página de Litaro y la portada termina cargándose dentro de sí misma.
const MAP_ORIGINS = ["https://www.google.com/maps/embed", "https://maps.google.com/"];

const mapUrl = (value) => {
  const text = String(value ?? "").trim();
  const url = text.startsWith("<") ? (text.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? "") : text;

  return MAP_ORIGINS.some((origin) => url.startsWith(origin)) ? url : null;
};

const reducer = (state, action) => {
  const total = action.length;

  switch (action.type) {
    case "previous":
      return {
        index: (state.index - 1 + total) % total,
      };

    case "next":
      return {
        index: (state.index + 1) % total,
      };

    default:
      return state;
  }
};

const LocationCardBoard = ({ locations }) => {
  const [state, dispatch] = useReducer(reducer, { index: 0 });

  if (!locations?.length) return null;

  const location = locations[state.index];
  const map = mapUrl(location.map);

  return (
    <div className={styles["location-card-board"]}>
      <div className={styles["left-location-card"]}>
        <h1>{location.title}</h1>

        <p>{location.description}</p>

        <img src={location.image} alt={location.title} loading="lazy" />

        <div className={styles["location-buttons"]}>
          <IoIosArrowDropleftCircle
            size={"3.5rem"}
            className={styles["previous-location-button"]}
            onClick={() =>
              dispatch({
                type: "previous",
                length: locations.length,
              })
            }
          />

          <IoIosArrowDroprightCircle
            size={"3.5rem"}
            className={styles["next-location-button"]}
            onClick={() =>
              dispatch({
                type: "next",
                length: locations.length,
              })
            }
          />
        </div>
      </div>

      <div className={styles["right-location-card"]}>
        {map ? (
          <iframe
            src={map}
            title={`Mapa de ${location.title}`}
            className={styles.map}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <p className={styles.mapUnavailable}>El mapa de esta sede no está disponible.</p>
        )}
      </div>
    </div>
  );
};

export default LocationCardBoard;
