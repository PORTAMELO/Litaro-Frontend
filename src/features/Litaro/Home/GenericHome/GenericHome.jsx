import { useAuth } from "../../../../shared/hooks/UseAuth";
import { roleLabel } from "../../../../shared/utils/ProfileOptions";

const GenericHome = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Bienvenido</h1>
            <p>Portal {roleLabel(user?.role) ?? "general"}.</p>
        </div>
    );
};

export default GenericHome;
