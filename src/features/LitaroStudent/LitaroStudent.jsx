import NavigationBar from "./components/NavigationBar";
import StudentCard from "./Home/components/StudentCard";
import ScheduleBoard from "./Home/components/ScheduleBoard";
import AchievementBoard from "./Home/components/AchievementBoard";
import EmotionBoard from "./Home/components/EmotionBoard";
import styles from "./styles/LitaroStudent.module.css";
import { Outlet } from "react-router-dom";
import { GrAchievement } from "react-icons/gr";
import studentImg from "../../assets/logoinps.jpg";



const student = {
  image: studentImg,
  grade: "Grado 8°",
  birthday: "13 años",
  name: "Juan Pérez",
};

const achievements = [
  {
    icon: GrAchievement,
    name: "Mejor promedio",
  },
  {
    icon: GrAchievement,
    name: "Mejor promedio",
  },
  {
    icon: GrAchievement,
    name: "Destacado en Inglés",
  },
  {
    icon: GrAchievement,
    name: "Mejor cantante",
  },
  {
    icon: GrAchievement,
    name: "Destacado en Español",
  },
];

const schedule = [
  {
    icon: GrAchievement,
    hour: "7:00 am - 9:00 am",
    subject: "Matemáticas",
  },
  {
    icon: GrAchievement,
    hour: "9:00 am - 11:00 am",
    subject: "Sociales",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Religión",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Música",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Artes",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Artes",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Artes",
  },
  {
    icon: GrAchievement,
    hour: "11:00 am - 1:00 pm",
    subject: "Artes",
  },
];

const emotions = [
  {
    icon: GrAchievement,
    name: "Feliz",
  },
  {
    icon: GrAchievement,
    name: "Tranquilo",
  },
  {
    icon: GrAchievement,
    name: "Triste",
  },
  {
    icon: GrAchievement,
    name: "Cansado",
  },
  {
    icon: GrAchievement,
    name: "Estresado",
  },
];

const LitaroStudent = () => {
  return (
    <div className={styles.layout}>
      <NavigationBar />

     <main className={styles.content}>
  <div className={styles["top-section"]}>
    <StudentCard
      image={student.image}
      grade={student.grade}
      birthday={student.birthday}
      name={student.name}
    />

    <ScheduleBoard schedule={schedule} />
  </div>

  <div className={styles["bottom-section"]}>
    <AchievementBoard achievements={achievements} />
    <EmotionBoard emotions={emotions} />
  </div>

  <Outlet />
  </main>
    </div>
  );
};

export default LitaroStudent;