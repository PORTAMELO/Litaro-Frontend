import { useId } from "react";
import { MenuItem, Select, Typography } from "@mui/material";

import styles from "../Observations.module.css";
import { mockFilters } from "../ObservationsData";

const GroupFilters = ({ filters, onFilterChange, onGradeChange }) => {
  const id = useId();

  return (
    <section className={styles.filtersCard}>
      <Typography className={styles.sectionTitle}>Seleccionar grupo</Typography>

      <div className={styles.filtersGrid}>
        <div className={styles.filter}>
          <label id={`${id}-year`}>Año académico</label>

          <Select
            labelId={`${id}-year`}
            size="small"
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            fullWidth
          >
            {mockFilters.years.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className={styles.filter}>
          <label id={`${id}-grade`}>Grado</label>

          <Select
            labelId={`${id}-grade`}
            size="small"
            value={filters.grade}
            onChange={(e) => onGradeChange(e.target.value)}
            fullWidth
          >
            {mockFilters.grades.map((grade) => (
              <MenuItem key={grade.id} value={grade.id}>
                {grade.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className={styles.filter}>
          <label id={`${id}-classroom`}>Grupo</label>

          <Select
            labelId={`${id}-classroom`}
            size="small"
            value={filters.classroom}
            onChange={(e) => onFilterChange("classroom", e.target.value)}
            fullWidth
          >
            {mockFilters.classrooms
              .filter((classroom) => classroom.grade === filters.grade)
              .map((classroom) => (
                <MenuItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </MenuItem>
              ))}
          </Select>
        </div>
      </div>
    </section>
  );
};

export default GroupFilters;
