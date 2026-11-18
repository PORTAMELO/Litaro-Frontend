import { useState } from "react";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import { formatDate, todayInColombia } from "@/shared/utils/Dates";
import * as service from "../services/ObservationService";
import { plain } from "../utils/CitationUtils";
import { KIND_OPTIONS, TYPES, canAny, emptyScope, kindLabel } from "../utils/ObservationUtils";
import CitationCreatePanel from "./CitationCreatePanel";
import ObservationDetailPanel from "./ObservationDetailPanel";
import ObservationFormPanel from "./ObservationFormPanel";
import ScopeFilters from "./ScopeFilters";

const ALL = "";

const RecordTab = ({ options, can, notify }) => {
  const canCreate = canAny(can, "create");
  const canUpdate = canAny(can, "update");
  const canCite = can("Citation", "create");
  const today = todayInColombia();

  const [scope, setScope] = useState(() => emptyScope(options, options.classrooms[0]?.classroomId ?? ALL));
  const [kind, setKind] = useState("");
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [form, setForm] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [citing, setCiting] = useState(null);

  const { classroomId } = scope;
  const filter = { ...scope, kind, coexistenceType: type };

  const students = useLoad(() => service.getStudents(classroomId), [classroomId], classroomId !== ALL);
  const observations = useLoad(() => service.getObservations(filter), [JSON.stringify(filter)]);

  const classroom = options.classrooms.find((item) => item.classroomId === classroomId);
  const query = plain(text.trim());
  const rows = (observations.data ?? []).filter(
    (row) => plain(row.studentName).includes(query) || plain(row.description).includes(query),
  );

  const saved = () => {
    setForm(null);
    observations.reload();
  };

  if (options.classrooms.length === 0) {
    return (
      <div className={page.card}>
        <EmptyState
          title="Sin cursos a su cargo"
          text="Las observaciones se registran sobre los estudiantes de los cursos donde tiene asignación o es director."
        />
      </div>
    );
  }

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <ScopeFilters options={options} value={scope} onChange={setScope} />

          <TextField
            select
            size="small"
            label="Tipo"
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            className={styles.filterField}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
          >
            {KIND_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Tipificación"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={styles.filterField}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
          >
            <MenuItem value="">Todas</MenuItem>
            {TYPES.map((item) => (
              <MenuItem key={item} value={item}>
                Tipo {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            placeholder="Buscar estudiante o texto"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={styles.searchField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Buscar estudiante o texto" },
            }}
          />
        </div>
      </div>

      {classroom && (
        <div className={page.card}>
          <div className={page.toolbar}>
            <h2 className={page.toolbarTitle}>Estudiantes de {classroom.name}</h2>
            {students.data && <span className={page.toolbarMeta}>{students.data.length} estudiantes</span>}
          </div>

          {students.error && <p className={page.message}>{students.error}</p>}

          {!students.error && !students.data && <TableSkeleton rows={5} columns={2} />}

          {students.data?.length === 0 && <EmptyState title="Sin estudiantes activos en el curso" />}

          {students.data?.length > 0 && (
            <div className={page.tableWrapper}>
              <table className={page.table}>
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    {(canCreate || canCite) && <th className={page.cellTight}>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {students.data.map((student) => (
                    <tr key={student.enrollmentId}>
                      <td>{student.studentName}</td>
                      {(canCreate || canCite) && (
                        <td className={page.cellTight}>
                          <div className={styles.rowActions}>
                            {canCreate && (
                              <Button size="small" variant="outlined" onClick={() => setForm({ student })}>
                                Observación
                              </Button>
                            )}
                            {canCite && (
                              <Button size="small" variant="outlined" onClick={() => setCiting(student)}>
                                Citar
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className={page.card}>
        <div className={page.toolbar}>
          <h2 className={page.toolbarTitle}>Observaciones registradas</h2>
          {observations.data && <span className={page.toolbarMeta}>{rows.length}</span>}
        </div>

        {observations.error && <p className={page.message}>{observations.error}</p>}

        {!observations.error && !observations.data && <TableSkeleton rows={6} columns={5} />}

        {observations.data && rows.length === 0 && (
          <EmptyState title="Sin observaciones" text="No hay observaciones con los filtros elegidos." />
        )}

        {rows.length > 0 && (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th className={page.cellTight}>Fecha</th>
                  <th>Estudiante</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Registró</th>
                  <th className={page.cellRight}>Compromisos</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.observationId}
                    className={page.rowClickable}
                    tabIndex={0}
                    onClick={() => setDetailId(row.observationId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setDetailId(row.observationId);
                      }
                    }}
                  >
                    <td className={page.cellTight}>{formatDate(row.date)}</td>
                    <td>
                      {row.studentName}
                      <span className={page.secondaryText}>{row.classroomName}</span>
                    </td>
                    <td>
                      <span className={page.chip}>{kindLabel(row)}</span>
                    </td>
                    <td className={styles.descriptionCell}>
                      {row.description}
                      {row.hasStatement && <span className={page.secondaryText}>Con descargos</span>}
                    </td>
                    <td>
                      {row.recordedBy}
                      {row.subjectName && <span className={page.secondaryText}>{row.subjectName}</span>}
                    </td>
                    <td className={page.cellRight}>
                      {row.commitments}
                      {row.pendingCommitments > 0 && (
                        <span className={page.secondaryText}>{row.pendingCommitments} pendientes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && (
        <ObservationFormPanel
          student={form.student}
          observation={form.observation}
          subjects={options.subjects}
          today={today}
          notify={notify}
          onClose={() => setForm(null)}
          onSaved={saved}
        />
      )}

      {citing && (
        <CitationCreatePanel
          student={citing}
          classrooms={options.classrooms}
          notify={notify}
          onClose={() => setCiting(null)}
          onSaved={() => setCiting(null)}
        />
      )}

      {detailId && !form && (
        <ObservationDetailPanel
          observationId={detailId}
          canUpdate={canUpdate}
          notify={notify}
          onClose={() => setDetailId(null)}
          onChanged={observations.reload}
          onEdit={(observation) =>
            setForm({
              observation,
              student: {
                enrollmentId: observation.enrollmentId,
                studentName: observation.studentName,
                classroomName: observation.classroomName,
              },
            })
          }
        />
      )}
    </>
  );
};

export default RecordTab;
