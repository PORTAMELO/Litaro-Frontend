import { MdOutlineAddPhotoAlternate } from "react-icons/md";

import styles from "../styles/PhotoSlot.module.css";
import { photoUrl } from "../utils/Images";

// Foto de una tarjeta. Si el contenido aún no tiene foto, muestra un recuadro que
// indica dónde va y que se carga desde Contenido Web.
const PhotoSlot = ({ src, alt = "", label, hint = "Se carga desde Contenido Web", className = "" }) => {
  const url = photoUrl(src);

  if (url) {
    return <img className={`${styles.photo} ${className}`} src={url} alt={alt} loading="lazy" />;
  }

  return (
    <div className={`${styles.slot} ${className}`} role="img" aria-label={`${label} (pendiente)`}>
      <MdOutlineAddPhotoAlternate className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.hint}>{hint}</span>
    </div>
  );
};

export default PhotoSlot;
