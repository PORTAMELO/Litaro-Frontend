import { FaBook, FaClipboardCheck, FaGraduationCap } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import SectionTitle from "../../../shared/components/SectionTitle";

import styles from "./styles/InicioProfesor.module.css";

import SummaryCard from "./components/SummaryCard";
import AssignedGradeCard from "./components/AssignedGradeCard";
import ActionCard from "./components/ActionCard";

const InicioProfesor = () => {
  const summary = [
    {
      title: "Grados Asignados",
      value: 7,
      subtitle: "11 Salones en total",
      color: "#72D84B",
      icon: <PiStudentFill />,
    },
    {
      title: "Cursos Asignados",
      value: 7,
      subtitle: "11 Salones en total",
      color: "#FDB54A",
      icon: <FaBook />,
    },
    {
      title: "Materias Asignadas",
      value: 7,
      subtitle: "11 Salones en total",
      color: "#C06AF2",
      icon: <FaGraduationCap />,
    },
  ];

  const grades = [
    {
      grade: "8° Grado",
      subjects: [
        {
          name: "Matemáticas",
          classroom: "Salones A, B",
        },
        {
          name: "Física",
          classroom: "Salones A, C",
        },
      ],
    },
    {
      grade: "8° Grado",
      subjects: [
        {
          name: "Matemáticas",
          classroom: "Salones A, B",
        },
        {
          name: "Física",
          classroom: "Salones A, C",
        },
      ],
    },
    {
      grade: "8° Grado",
      subjects: [
        {
          name: "Matemáticas",
          classroom: "Salones A, B",
        },
        {
          name: "Física",
          classroom: "Salones A, C",
        },
      ],
    },
    {
      grade: "8° Grado",
      subjects: [
        {
          name: "Matemáticas",
          classroom: "Salones A, B",
        },
        {
          name: "Física",
          classroom: "Salones A, C",
        },
      ],
    },
  ];

  const actions = [
    {
      title: "Registro de Notas",
      description:
        "Gestiona actividades, talleres y evaluaciones de tus materias.",
      color: "#0F4DB8",
      icon: <FaGraduationCap />,
    },
    {
      title: "Registro de Asistencia",
      description: "Control diario de asistencia por clase.",
      color: "#C06AF2",
      icon: <FaClipboardCheck />,
    },
  ];

  return (
    <section className={styles.container}>
      <SectionTitle text="Bienvenido Profesor Juan Manuel" />

      <div className={styles.summary}>
        {summary.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      <div className={styles.grades}>
        <SectionTitle text="Tus grados asignados" />

        <div className={styles.gradesGrid}>
          {grades.map((grade, index) => (
            <AssignedGradeCard key={index} {...grade} />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {actions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </div>
    </section>
  );
};

export default InicioProfesor;
