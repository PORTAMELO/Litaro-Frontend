import { useReducer } from "react";
import styles from "../styles/LocationCardBoard.module.css";
import { parseMapLink } from "../../utils/MapLink";
import { FaMapLocationDot } from "react-icons/fa6";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

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
  const map = parseMapLink(location.map);

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
        {map?.embed ? (
          <iframe
            src={map.embed}
            title={`Mapa de ${location.title}`}
            className={styles.map}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : map?.link ? (
          <div className={styles.mapUnavailable}>
            <FaMapLocationDot className={styles.mapIcon} aria-hidden="true" />
            <a className={styles.mapLink} href={map.link} target="_blank" rel="noopener noreferrer">
              Ver ubicación en Google Maps
            </a>
          </div>
        ) : (
          <p className={styles.mapUnavailable}>El mapa de esta sede no está disponible.</p>
        )}
      </div>
    </div>
  );
};

export default LocationCardBoard;
