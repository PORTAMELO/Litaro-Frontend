import { useAuth } from "../../../shared/hooks/useAuth";

import AdministratorHome from "./AdministratorHome/AdministratorHome";
import ProfessorHome from "./ProfessorHome/ProfessorHome";
import StudentHome from "./StudentHome/StudentHome";
import ParentHome from "./ParentHome/ParentHome";

const Home = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "Administrador":
      return <AdministratorHome />;

    case "Profesor":
      return <ProfessorHome />;

    case "Estudiante":
      return <StudentHome />;

    case "Padre":
      return <ParentHome />;
  }
};

export default Home;
