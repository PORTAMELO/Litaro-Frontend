import { useAuth } from "../../../shared/hooks/UseAuth";

import AdministratorHome from "./AdministratorHome/AdministratorHome";
import ProfessorHome from "./ProfessorHome/ProfessorHome";
import StudentHome from "./StudentHome/StudentHome";
import ParentHome from "./ParentHome/ParentHome";
import GenericHome from "./GenericHome/GenericHome";

const Home = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "Administrador":
      return <AdministratorHome />;

    case "Profesor":
      return <ProfessorHome />;

    case "Estudiante":
      return <StudentHome />;

    case "Acudiente":
      return <ParentHome />;

    default:
      return <GenericHome />;
  }
};

export default Home;