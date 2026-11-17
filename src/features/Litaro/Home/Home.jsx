import { useAuth } from "@/shared/hooks/useAuth";
import { ROLES } from "@/shared/utils/Roles";

import AdministratorHome from "./AdministratorHome/AdministratorHome";
import ProfessorHome from "./ProfessorHome/ProfessorHome";
import StudentHome from "./StudentHome/StudentHome";
import ParentHome from "./ParentHome/ParentHome";
import GenericHome from "./GenericHome/GenericHome";

const Home = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case ROLES.ADMIN:
      return <AdministratorHome />;

    case ROLES.TEACHER:
      return <ProfessorHome />;

    case ROLES.STUDENT:
      return <StudentHome />;

    case ROLES.PARENT:
      return <ParentHome />;

    default:
      return <GenericHome />;
  }
};

export default Home;