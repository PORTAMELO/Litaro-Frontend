import { useEffect, useState } from "react";
import { MdLogout, MdSwapHoriz } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logoinps.jpg";
import styles from "./NavigationBar.module.css";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { getSummary } from "../Notifications/services/NotificationService";
import { NOTIFICATIONS_CHANGED } from "../Notifications/utils/NotificationUtils";
import { getRoleOptions, roleLabel } from "@/shared/utils/ProfileOptions";
import { litaroModules, modulePath } from "../LitaroRoutes";
import { PATHS } from "@/shared/utils/Paths";

// En pantallas de menos de 900 px la barra es un cajón: `open` lo muestra y
// `onNavigate` lo cierra al elegir una opción.
const NavigationBar = ({ id, open = false, onNavigate }) => {
  const { user, logout, clearChosenRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { can, sees } = usePermissions();
  const [unread, setUnread] = useState(0);

  const watchesInbox = can("Notification", "read");

  useEffect(() => {
    if (!watchesInbox) return undefined;

    let cancelled = false;

    const refresh = () =>
      getSummary()
        .then((summary) => {
          if (!cancelled) setUnread(summary?.unread ?? 0);
        })
        .catch(() => {});

    refresh();
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh);

    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATIONS_CHANGED, refresh);
    };
  }, [watchesInbox, location.pathname]);

  const options = litaroModules.filter((module) => sees(module.keys));

  const canSwitchProfile = getRoleOptions(user).length > 1;

  const handleSwitchProfile = () => {
    onNavigate?.();
    clearChosenRole();
    navigate(PATHS.selectProfile);
  };

  return (
    <nav
      id={id}
      aria-label="Menú principal"
      className={open ? `${styles["navigation-bar"]} ${styles.open}` : styles["navigation-bar"]}
    >
      {/*Header*/}
      <div className={styles["navigation-header"]}>
        <img src={logo} alt="" />
        <div className={styles["navigation-header-title"]}>
          <p>Litaro INPS</p>
          <span>Portal {roleLabel(user?.role)}</span>
        </div>
      </div>

      {/*Options*/}
      <div className={styles["navigation-options"]}>
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <NavLink
              key={option.path}
              to={modulePath(option)}
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              <Icon className={styles.icon} aria-hidden="true" />
              <span>{option.label}</span>
              {option.counted && watchesInbox && unread > 0 && <b className={styles.count}>{unread}</b>}
            </NavLink>
          );
        })}

        {canSwitchProfile && (
          <button type="button" onClick={handleSwitchProfile} className={styles["navigation-switch"]}>
            <MdSwapHoriz className={styles.icon} aria-hidden="true" />
            <span>Cambiar de vista</span>
          </button>
        )}
      </div>

      {/*Profile*/}
      <div className={styles["navigation-profile"]}>
        <img src={logo} alt="" />
        <div className={styles["navigation-profile-title"]}>
          <p>{user?.firstName || user?.lastName ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() : "Usuario"}</p>
          <span>{user?.email ?? "Sin email registrado"}</span>
        </div>
        <button type="button" onClick={logout} className={styles["navigation-logout-button"]} title="Cerrar sesión" aria-label="Cerrar sesión">
          <MdLogout className={styles.icon} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;