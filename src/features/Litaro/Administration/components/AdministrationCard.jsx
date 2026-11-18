import styles from "../styles/AdministrationCard.module.css";
import Button from "@/shared/components/Button/Button";
import { BsPencilFill } from "react-icons/bs";

const AdministrationCard = ({ title, records, onManage }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h3>{title}</h3>

        {records !== undefined && <p>{records} Registros</p>}

        <div className={styles.actions}>
          <Button variant="tertiary" align="left" onClick={onManage}>
            <>
              <BsPencilFill />
              Administrar
            </>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdministrationCard;