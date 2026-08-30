import { Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import styles from "./Litaro.module.css";

const Litaro = () => {
  return (
    <div className={styles.layout}>
      <NavigationBar />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default Litaro;
