import { usePermissions } from "@/shared/hooks/usePermissions";
import { Unauthorized } from "@/shared/components/StatusPage/StatusPage";
import { ContentSkeleton } from "@/shared/components/Ui/Ui";

// Deja entrar a un módulo solo si el perfil activo tiene alguna de sus claves de permiso.
// Usa la misma regla que el menú, así escribir la URL a mano no salta el control.
const ModuleGuard = ({ keys, children }) => {
  const { sees, ready } = usePermissions();

  if (!ready) return <ContentSkeleton />;

  if (!sees(keys)) return <Unauthorized />;

  return children;
};

export default ModuleGuard;
