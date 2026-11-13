import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, SegmentedFilter, StatusMark, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Grades.module.css";
import * as service from "../services/GradingService";
import { NEUTRAL_COLOR, formatColombiaDateTime } from "../utils/GradingUtils";
import { usePlannerFiles } from "../hooks/UsePlannerFiles";
import { DeleteButton, UploadButton, ViewButton } from "./PlannerUpload";

const ALL = "";

const unique = (rows, id, name) =>
  [...new Map(rows.map((row) => [row[id], row[name]])).entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));

const Filter = ({ label, value, items, onChange }) => (
  <TextField
    select
    size="small"
    className={styles.selectSmall}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{ select: { displayEmpty: true }, htmlInput: { "aria-label": label } }}
  >
    <MenuItem value={ALL}>{label}</MenuItem>
    {items.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </TextField>
);

const PlannerPanelTab = ({ notify }) => {
  const { data, error, reload } = useLoad(() => service.getPanel(), []);
  const [state, setState] = useState("all");
  const [teacher, setTeacher] = useState(ALL);
  const [grade, setGrade] = useState(ALL);
  const [subject, setSubject] = useState(ALL);
  const files = usePlannerFiles({ notify, onChanged: reload });

  if (error) return <p className={page.message}>{error}</p>;
  if (!data) return <TableSkeleton rows={8} columns={6} />;

  const filtered = data.rows.filter(
    (row) =>
      (teacher === ALL || row.teacherId === teacher) &&
      (grade === ALL || row.gradeId === grade) &&
      (subject === ALL || row.subjectId === subject),
  );
  const delivered = filtered.filter((row) => row.delivered).length;
  const rows = filtered.filter(
    (row) => state === "all" || (state === "delivered" ? row.delivered : !row.delivered),
  );

  return (
    <div className={page.card}>
      <div className={page.toolbar}>
        <SegmentedFilter
          label="Estado"
          value={state}
          onChange={setState}
          options={[
            { value: "all", label: "Todos", count: filtered.length },
            { value: "delivered", label: "Entregados", count: delivered },
            { value: "pending", label: "Pendientes", count: filtered.length - delivered },
          ]}
        />

        <Filter label="Docente" value={teacher} items={unique(data.rows, "teacherId", "teacherName")} onChange={setTeacher} />
        <Filter label="Grado" value={grade} items={unique(data.rows, "gradeId", "gradeName")} onChange={setGrade} />
        <Filter label="Materia" value={subject} items={unique(data.rows, "subjectId", "subjectName")} onChange={setSubject} />

        <span className={page.toolbarSpacer} />
        {data.dueAt && <span className={page.toolbarMeta}>Plazo: {formatColombiaDateTime(data.dueAt)}</span>}
      </div>

      {rows.length === 0 && <EmptyState title="Sin asignaciones para mostrar" />}

      {rows.length > 0 && (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                <th>Docente</th>
                <th>Curso</th>
                <th>Materia</th>
                <th>Estado</th>
                <th>Cargado</th>
                <th className={page.cellTight} />
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.assignmentId}>
                  <td>{row.teacherName}</td>
                  <td>{row.classroomName}</td>
                  <td>{row.subjectName}</td>
                  <td>
                    <StatusMark
                      label={row.delivered ? "Entregado" : "Pendiente"}
                      color={row.delivered ? "var(--primary-color)" : NEUTRAL_COLOR}
                    />
                  </td>
                  <td>{row.document && formatColombiaDateTime(row.document.uploadedAt)}</td>
                  <td className={page.cellTight}>
                    {row.document && (
                      <ViewButton disabled={files.busy !== null} onClick={() => files.open(row.assignmentId)} />
                    )}

                    {data.canUploadAny && (
                      <UploadButton
                        replace={Boolean(row.document)}
                        disabled={files.busy !== null}
                        onFile={(file) => files.upload(row.assignmentId, file)}
                      />
                    )}

                    {data.canUploadAny && row.document && (
                      <DeleteButton disabled={files.busy !== null} onConfirm={() => files.remove(row.assignmentId)} />
                    )}
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

export default PlannerPanelTab;
