import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ContentSkeleton } from "../../shared/components/Ui/Ui";
import NavigationBar from "./components/NavigationBar";
import styles from "./Litaro.module.css";

const Litaro = () => {
  return (
    <div className={styles.layout}>
      <NavigationBar />
      <main className={styles.content}>
        <Suspense fallback={<ContentSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Litaro;
