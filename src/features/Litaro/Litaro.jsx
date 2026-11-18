import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { ContentSkeleton } from "@/shared/components/Ui/Ui";
import SkipLink from "@/shared/components/SkipLink/SkipLink";
import NavigationBar from "./components/NavigationBar";
import styles from "./Litaro.module.css";

const NAVIGATION_ID = "litaro-navegacion";
const CONTENT_ID = "contenido";

const Litaro = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  // Con el cajón abierto: el foco entra al menú y Escape lo cierra.
  useEffect(() => {
    if (!menuOpen) return undefined;

    document.getElementById(NAVIGATION_ID)?.querySelector("a, button")?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <div className={styles.layout}>
      <SkipLink target={CONTENT_ID} />

      <header className={styles.topbar}>
        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls={NAVIGATION_ID}
          onClick={() => setMenuOpen(true)}
        >
          <MdMenu aria-hidden="true" />
        </button>
        <span className={styles.topbarTitle}>Litaro INPS</span>
      </header>

      <NavigationBar id={NAVIGATION_ID} open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      {menuOpen && <div className={styles.scrim} onClick={closeMenu} aria-hidden="true" />}

      <main id={CONTENT_ID} tabIndex={-1} className={styles.content}>
        <Suspense fallback={<ContentSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Litaro;
