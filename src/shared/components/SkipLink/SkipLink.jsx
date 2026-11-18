import styles from "./SkipLink.module.css";

// Primer elemento enfocable de la página: permite saltar el menú con el teclado.
const SkipLink = ({ target }) => (
  <a className={styles.skipLink} href={`#${target}`}>
    Saltar al contenido
  </a>
);

export default SkipLink;
