import styles from "../styles/AdministracionCard.module.css";
import Button from "../../../../shared/components/Button/Button";
import colegio from "../../../../assets/colegio.jpeg";
import { BsPencilFill } from "react-icons/bs";

const AdministracionCard = ({ title, records, color, onManage }) => {
  return (
    <div
      className={styles.card}
      style={{
        "--card-color": color,
        "--card-image": `url(${colegio})`,
      }}
    >
      <div className={styles.info}>
        <h3>{title}</h3>

        <p>{records} Registros</p>

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

export default AdministracionCard;
