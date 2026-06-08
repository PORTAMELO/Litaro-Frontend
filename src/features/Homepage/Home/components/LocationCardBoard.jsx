import { useReducer } from "react";
import styles from "../styles/LocationCardBoard.module.css";
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

  const location = locations[state.index];

  return (
    <div className={styles["location-card-board"]}>
      <div className={styles["left-location-card"]}>
        <h1> {location.title}</h1>
        <p>{location.description}</p>
        <img src={location.image} alt={location.title} />
        <div className={styles["location-buttons"]}>
          <IoIosArrowDropleftCircle
            size={"3.5rem"}
            className={styles["previous-location-button"]}
            onClick={() =>
              dispatch({ type: "previous", length: locations.length })
            }
          >
            Anterior
          </IoIosArrowDropleftCircle>

          <IoIosArrowDroprightCircle
            size={"3.5rem"}
            className={styles["next-location-button"]}
            onClick={() => dispatch({ type: "next", length: locations.length })}
          >
            Siguiente
          </IoIosArrowDroprightCircle>
        </div>
      </div>

      <div className={styles["right-location-card"]}>
        <iframe
          src={location.map}
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationCardBoard;
