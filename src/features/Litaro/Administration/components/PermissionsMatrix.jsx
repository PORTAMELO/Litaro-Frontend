import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TextField,
    Select,
    MenuItem,
    Button,
    Stack,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import * as service from "../services/AdministrationService";
import { PERMISSION } from "../../../../shared/utils/Permissions";

// Nombres amigables de las tablas que se administran desde estas tarjetas.
// Deben coincidir con ManagedTables en RolePermissionEndpoints.cs.
const TABLE_LABELS = {
    School: "Colegio",
    Campus: "Sedes",
    AcademicYear: "Años académicos",
    AcademicPeriod: "Períodos académicos",
    Characteristic: "Características",
    CharacteristicDetail: "Detalles de característica",
    User: "Usuarios",
    Student: "Estudiantes",
    Parent: "Padres",
    Teacher: "Profesores",
    Grade: "Grados",
    Classroom: "Salones",
    Subject: "Materias",
    AcademicAssignment: "Asignaciones",
    Schedule: "Horarios",
    Enrollment: "Matrículas",
    GradeScore: "Notas",
    Attendance: "Asistencia",
    StudentLog: "Observador",
};

// Matriz de permisos por rol: no reutiliza RecordsTable/DynamicForm porque
// "Permissions" es un bitmask (Read/Create/Update/Delete) que aquí se edita
// como checkboxes, una fila por tabla administrable, para el rol seleccionado.
const PermissionsMatrix = ({ open, onClose, canEdit }) => {
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savingTable, setSavingTable] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;

        service.getRoles().then((data) => {
            setRoles(data);
            setRoleId((previous) => previous || data[0]?.id || "");
        });
    }, [open]);

    useEffect(() => {
        if (!open || !roleId) return;

        setLoading(true);
        setError(null);

        service
            .getRolePermissions(roleId)
            .then(setRows)
            .catch(() => setError("No fue posible cargar los permisos."))
            .finally(() => setLoading(false));
    }, [open, roleId]);

    const toggleFlag = (tableName, flag) => {
        setRows((previous) =>
            previous.map((row) => (row.tableName === tableName ? { ...row, permissions: row.permissions ^ flag } : row)),
        );
    };

    const changeView = (tableName, view) => {
        setRows((previous) => previous.map((row) => (row.tableName === tableName ? { ...row, view } : row)));
    };

    const handleSaveRow = async (row) => {
        setSavingTable(row.tableName);
        setError(null);

        try {
            await service.saveRolePermission({
                roleId,
                tableName: row.tableName,
                permissions: row.permissions,
                view: row.view,
            });
        } catch (err) {
            setError(err.message ?? "No fue posible guardar los permisos.");
        } finally {
            setSavingTable(null);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Permisos por rol</DialogTitle>

            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
                    <Select size="small" value={roleId} onChange={(event) => setRoleId(event.target.value)} displayEmpty>
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Stack alignItems="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                    </Stack>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tabla</TableCell>
                                <TableCell align="center">Ver</TableCell>
                                <TableCell align="center">Crear</TableCell>
                                <TableCell align="center">Editar</TableCell>
                                <TableCell align="center">Eliminar</TableCell>
                                <TableCell>Vista (URL)</TableCell>
                                <TableCell align="center">Guardar</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.tableName}>
                                    <TableCell>{TABLE_LABELS[row.tableName] ?? row.tableName}</TableCell>

                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            disabled={!canEdit}
                                            checked={(row.permissions & PERMISSION.READ) !== 0}
                                            onChange={() => toggleFlag(row.tableName, PERMISSION.READ)}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            disabled={!canEdit}
                                            checked={(row.permissions & PERMISSION.CREATE) !== 0}
                                            onChange={() => toggleFlag(row.tableName, PERMISSION.CREATE)}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            disabled={!canEdit}
                                            checked={(row.permissions & PERMISSION.UPDATE) !== 0}
                                            onChange={() => toggleFlag(row.tableName, PERMISSION.UPDATE)}
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            disabled={!canEdit}
                                            checked={(row.permissions & PERMISSION.DELETE) !== 0}
                                            onChange={() => toggleFlag(row.tableName, PERMISSION.DELETE)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            size="small"
                                            variant="standard"
                                            fullWidth
                                            value={row.view ?? ""}
                                            disabled={!canEdit}
                                            onChange={(event) => changeView(row.tableName, event.target.value)}
                                            placeholder="/Litaro/..."
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Tooltip title="Guardar">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    disabled={!canEdit || savingTable === row.tableName}
                                                    onClick={() => handleSaveRow(row)}
                                                >
                                                    <SaveIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} size="small">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionsMatrix;
