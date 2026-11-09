import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "../Enrollment.module.css";

const SidePanel = ({ open, title, subtitle, busy = false, onClose, footer, children }) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={busy ? undefined : onClose}
    slotProps={{ paper: { className: styles.panel, "aria-label": title } }}
  >
    <div className={styles.panelHeader}>
      <div>
        <h2 className={styles.panelTitle}>{title}</h2>
        {subtitle && <div className={styles.panelSubtitle}>{subtitle}</div>}
      </div>

      <IconButton size="small" aria-label="Cerrar" onClick={onClose} disabled={busy}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>

    <div className={styles.panelBody}>{children}</div>

    {footer && <div className={styles.panelFooter}>{footer}</div>}
  </Drawer>
);

export default SidePanel;
