import { Component } from "react";

import styles from "./Ui/Skeletons.module.css";

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className={styles.cardPage} role="alert">
        <div className={styles.card}>
          <p className={styles.errorText}>No fue posible cargar esta sección. Revisa tu conexión e intenta de nuevo.</p>
          <button type="button" className={styles.retry} onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      </div>
    );
  }
}

export default RouteErrorBoundary;
