import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import * as service from "../services/AttendanceService";
import { formatHours } from "../utils/AttendanceUtils";

const pick = { minWidth: "9rem" };

const SummaryTab = ({ options }) => {
  const [chosenPeriod, setChosenPeriod] = useState(null);
  const [chosenClassroom, setChosenClassroom] = useState(null);
  const [chosenSubject, setChosenSubject] = useState(null);

  const periodId =
    chosenPeriod ?? options.periods.find((period) => period.current)?.periodId ?? options.periods[0]?.periodId ?? "";
  const classroomId = chosenClassroom ?? options.classrooms[0]?.classroomId ?? "";

  const subjects = options.subjects.filter((subject) => subject.classroomId === classroomId);
  const subjectId = subjects.some((subject) => subject.subjectId === chosenSubject)
    ? chosenSubject
    : (subjects[0]?.subjectId ?? "");

  const ready = Boolean(periodId && classroomId && subjectId);

  const { data, error, loading } = useLoad(
    () => service.getSummary(periodId, classroomId, subjectId),
    [periodId, classroomId, subjectId],
    ready,
  );

  const summary = ready && !loading ? data : null;

  return (
    <div className={page.card}>
      <div className={page.toolbar}>
        <TextField
          select
          size="small"
          sx={pick}
          value={periodId}
          onChange={(event) => setChosenPeriod(event.target.value)}
          slotProps={{ htmlInput: { "aria-label": "Periodo" } }}
        >
          {options.periods.map((period) => (
            <MenuItem key={period.periodId} value={period.periodId}>
              Periodo {period.periodNumber}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          sx={pick}
          value={classroomId}
          onChange={(event) => setChosenClassroom(event.target.value)}
          slotProps={{ htmlInput: { "aria-label": "Curso" } }}
        >
          {options.classrooms.map((classroom) => (
            <MenuItem key={classroom.classroomId} value={classroom.classroomId}>
              {classroom.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          sx={pick}
          value={subjectId}
          onChange={(event) => setChosenSubject(event.target.value)}
          slotProps={{ htmlInput: { "aria-label": "Materia" } }}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.subjectId} value={subject.subjectId}>
              {subject.name}
            </MenuItem>
          ))}
        </TextField>

        <span className={page.toolbarSpacer} />

        {summary && (
          <span className={page.toolbarMeta}>
            {formatHours(summary.plannedHours)} clases en el periodo · pérdida al {formatHours(summary.lossPercent)} %
          </span>
        )}
      </div>

      {!ready && <EmptyState title="Sin cursos ni materias para mostrar" />}

      {ready && error && <p className={page.message}>{error}</p>}

      {ready && !error && !summary && <TableSkeleton rows={8} columns={5} />}

      {summary && Number(summary.plannedHours) === 0 && <EmptyState title="Esta materia no tiene clases en el horario" />}

      {summary && Number(summary.plannedHours) > 0 && (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th className={page.cellRight}>Sin justificar</th>
                <th className={page.cellRight}>Justificadas</th>
                <th className={page.cellRight}>Inasistencia</th>
                <th className={page.cellCenter}>Pérdida por fallas</th>
              </tr>
            </thead>

            <tbody>
              {summary.students.map((row) => (
                <tr key={row.enrollmentId} className={row.lost ? page.rowStrong : ""}>
                  <td>{row.studentName}</td>
                  <td className={page.cellRight}>{formatHours(row.unjustified)}</td>
                  <td className={page.cellRight}>{formatHours(row.justified)}</td>
                  <td className={page.cellRight}>{formatHours(row.percent)} %</td>
                  <td className={page.cellCenter}>
                    {row.lost && <CheckIcon fontSize="small" color="primary" aria-label="Pérdida por fallas" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
