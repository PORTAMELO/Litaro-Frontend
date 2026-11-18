import { MenuItem, TextField } from "@mui/material";

import styles from "../Observations.module.css";
import { ALL_SCOPE as ALL, classroomsIn } from "../utils/ObservationUtils";

const unique = (items, key, label) => {
  const seen = new Map();
  items.forEach((item) => {
    if (!seen.has(item[key])) seen.set(item[key], { value: item[key], label: item[label] });
  });
  return [...seen.values()];
};

// Año, sede, grado y curso. Los cursos son los del año en curso; en otro año solo
// aplican sede y grado.
const ScopeFilters = ({ options, value, onChange }) => {
  const currentYear = value.yearId === (options.yearId ?? ALL);
  const campuses = unique(options.classrooms, "campusId", "campusName");
  const grades = unique(
    options.classrooms.filter((item) => value.campusId === ALL || item.campusId === value.campusId),
    "gradeId",
    "gradeName",
  );
  const classrooms = classroomsIn(options, value);

  const change = (field, next) => {
    const scope = { ...value, [field]: next };
    if (field === "yearId" && next !== options.yearId) scope.classroomId = ALL;
    if (field === "campusId") scope.gradeId = ALL;
    if (field !== "classroomId" && !classroomsIn(options, scope).some((item) => item.classroomId === scope.classroomId))
      scope.classroomId = ALL;
    onChange(scope);
  };

  const select = (field, label, items, allLabel) => (
    <TextField
      select
      size="small"
      label={label}
      value={value[field]}
      onChange={(event) => change(field, event.target.value)}
      className={styles.filterField}
      slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
    >
      {allLabel && <MenuItem value={ALL}>{allLabel}</MenuItem>}
      {items.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      {select(
        "yearId",
        "Año",
        options.years.map((year) => ({ value: year, label: String(year) })),
        null,
      )}
      {campuses.length > 1 && select("campusId", "Sede", campuses, "Todas")}
      {select("gradeId", "Grado", grades, "Todos")}
      {currentYear &&
        select(
          "classroomId",
          "Curso",
          classrooms.map((item) => ({ value: item.classroomId, label: `${item.name} · ${item.campusName}` })),
          "Todos los cursos",
        )}
    </>
  );
};

export default ScopeFilters;
