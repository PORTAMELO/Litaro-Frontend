import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Typography, Stack } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";

import { useAuth } from "../../shared/hooks/useAuth";
import { getRoleOptions } from "../../shared/utils/profileOptions";
import logo from "../../assets/logoinps.jpg";
import styles from "./SelectProfile.module.css";

const ICONS = {
    Estudiante: SchoolIcon,
    Profesor: GroupsIcon,
    Acudiente: PersonIcon,
    Administrador: AdminPanelSettingsIcon,
};

const SelectProfile = () => {
    const { user, chooseRole } = useAuth();
    const navigate = useNavigate();

    const options = getRoleOptions(user);

    const handleSelect = (role) => {
        chooseRole(role);
        navigate("/Litaro", { replace: true });
    };

    if (options.length === 0) {
        return (
            <div className={styles.container}>
                <img src={logo} alt="Logo INPS" className={styles.logo} />
                <Typography variant="h6">Tu cuenta no tiene ningún perfil ni rol activo asignado.</Typography>
                <Typography variant="body2" color="text.secondary">
                    Contacta al administrador del colegio para que te asigne un perfil o un rol.
                </Typography>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <img src={logo} alt="Logo INPS" className={styles.logo} />

            <Typography variant="h5" sx={{ mb: 0.5 }}>
                Hola{user?.firstName ? `, ${user.firstName}` : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tienes más de un acceso disponible. Elige con cuál quieres entrar.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                {options.map((option) => {
                    const Icon = ICONS[option.role] ?? BadgeIcon;

                    return (
                        <Card key={option.role} className={styles.card}>
                            <CardActionArea onClick={() => handleSelect(option.role)} sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                    <Icon sx={{ fontSize: 40, color: "#0F4DB8" }} />
                                    <CardContent sx={{ p: "0 !important", textAlign: "center" }}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {option.label}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </CardActionArea>
                        </Card>
                    );
                })}
            </Stack>
        </div>
    );
};

export default SelectProfile;