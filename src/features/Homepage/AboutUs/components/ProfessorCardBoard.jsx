import ui from "../../styles/Public.module.css";
import styles from "../styles/ProfessorCardBoard.module.css";
import PhotoSlot from "../../components/PhotoSlot";

const ProfessorCardBoard = ({ professors }) => (
  <div className={styles.grid}>
    {professors.map((professor, index) => (
      <article key={`${index}-${professor.name}`} className={styles.card}>
        <PhotoSlot className={styles.photo} src={professor.image} alt={professor.name} label="Foto del docente" />
        <div>
          <h3 className={styles.name}>{professor.name}</h3>
          <p className={styles.role}>{professor.role}</p>
          <p className={professor.description ? styles.description : `${styles.description} ${ui.pending}`}>
            {professor.description || "Descripción pendiente."}
          </p>
        </div>
      </article>
    ))}
  </div>
);

export default ProfessorCardBoard;
