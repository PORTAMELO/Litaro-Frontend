import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import * as service from "../services/AdministrationService";

const UserRolesManager = ({ open, user, onClose, canEdit, onSaved }) => {
    const [allRoles, setAllRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const userId = user?.id ?? user?.userId ?? user?.Id;

    useEffect(() => {
        if (!open || !userId) return;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const [rolesResult, userRolesResult] = await Promise.all([
                    service.getRoles(),
                    service.getUserRoles(userId),
                ]);

                setAllRoles(rolesResult ?? []);
                setSelectedRoles(userRolesResult?.roles ?? []);
            } catch (err) {
                setError(err.message ?? "No fue posible cargar los roles.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, userId]);

    const toggleRole = (roleName) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const result = await service.setUserRoles(userId, selectedRoles);
            setSelectedRoles(result?.roles ?? selectedRoles);
            onSaved?.(result);
            onClose?.();
        } catch (err) {
            setError(err.message ?? "No fue posible guardar los roles.");
        } finally {
            setSaving(false);
        }
    };

    const userLabel = user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || `Usuario #${userId}`
        : "";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Roles de {userLabel}</DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <CircularProgress size={24} />
                ) : (
                    <FormGroup>
                        {allRoles.map((role) => (
                            <FormControlLabel
                                key={role.id ?? role.Id}
                                control={
                                    <Checkbox
                                        checked={selectedRoles.includes(role.name ?? role.Name)}
                                        onChange={() => toggleRole(role.name ?? role.Name)}
                                        disabled={!canEdit || saving}
                                    />
                                }
                                label={role.name ?? role.Name}
                            />
                        ))}

                        {allRoles.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No hay roles creados todavía.
                            </Typography>
                        )}
                    </FormGroup>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={!canEdit || saving || loading}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserRolesManager;
