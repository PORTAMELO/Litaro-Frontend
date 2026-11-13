import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, StatusMark, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Attendance.module.css";
import * as service from "../services/AttendanceService";
import { NOVELTY, OBSERVATION_LIMIT } from "../utils/AttendanceUtils";

const RollSheet = ({ classroomId, date, startTime, notify, onSaved }) => {
  const { data: sheet, error, reload } = useLoad(() => service.getSheet(classroomId, date, startTime), [
    classroomId,
    date,
    startTime,
  ]);

  const [stamp, setStamp] = useState(0);

  if (error) return <p className={page.message}>{error}</p>;
  if (!sheet) return <TableSkeleton rows={8} columns={4} />;

  return (
    <RollSheetForm
      key={`${sheet.sessionId ?? "new"}|${stamp}`}
      sheet={sheet}
      notify={notify}
      onSaved={() => {
        setStamp((current) => current + 1);
        reload();
        onSaved();
      }}
    />
  );
};

const RollSheetForm = ({ sheet, notify, onSaved }) => {
  const isClass = sheet.kind === "CLASS";

  const [absent, setAbsent] = useState(() => sheet.students.filter((s) => s.status).map((s) => s.enrollmentId));
  const [tardies, setTardies] = useState(() =>
    Object.fromEntries(sheet.students.filter((s) => s.late).map((s) => [s.enrollmentId, s.tardyObservation ?? ""])),
  );
  const [evasion, setEvasion] = useState(null);
  const [tardy, setTardy] = useState(null);
  const [saving, setSaving] = useState(false);

  const locked = !sheet.canEdit || saving;
  const title = sheet.subjectName ? `${sheet.subjectName} · ${sheet.classroomName}` : sheet.classroomName;

  const markAbsent = (student) => {
    setAbsent((current) => [...current, student.enrollmentId]);
    setTardies((current) => {
      const next = { ...current };
      delete next[student.enrollmentId];
      return next;
    });
  };

  const choose = (student, isAbsent) => {
    if (!isAbsent) {
      setAbsent((current) => current.filter((id) => id !== student.enrollmentId));
      return;
    }

    if (isClass && student.earlierClass) {
      setEvasion(student);
      return;
    }

    markAbsent(student);
  };

  const toggleTardy = (student) => {
    if (student.enrollmentId in tardies) {
      setTardies((current) => {
        const next = { ...current };
        delete next[student.enrollmentId];
        return next;
      });
      return;
    }

    if (isClass) {
      setTardy({ student, text: "" });
      return;
    }

    setTardies((current) => ({ ...current, [student.enrollmentId]: "" }));
  };

  const save = async () => {
    setSaving(true);

    try {
      await service.saveSheet({
        classroomId: sheet.classroomId,
        date: sheet.date,
        startTime: sheet.startTime,
        absentEnrollmentIds: absent,
        tardies: Object.entries(tardies).map(([enrollmentId, observation]) => ({
          enrollmentId: Number(enrollmentId),
          observation: observation || null,
        })),
      });
      notify("Lista guardada.");
      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible guardar la lista.", "error");
      setSaving(false);
    }
  };

  const noveltyOf = (student, isAbsent) => {
    if (student.enrollmentId in tardies) return NOVELTY.TARDY;
    if (!isAbsent) return null;
    if (student.justified && student.status) return NOVELTY.JUSTIFIED;
    if (isClass && student.earlierClass) return NOVELTY.EVASION;

    return null;
  };

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <span className={page.toolbarTitle}>{title}</span>
          <span className={page.toolbarMeta}>
            {sheet.students.length} estudiantes · {absent.length} {absent.length === 1 ? "ausente" : "ausentes"}
          </span>
          <span className={page.toolbarSpacer} />
          <Button variant="contained" onClick={save} disabled={locked}>
            Guardar
          </Button>
        </div>

        {sheet.students.length === 0 ? (
          <EmptyState title="Este curso no tiene estudiantes matriculados" />
        ) : (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <tbody>
                {sheet.students.map((student) => {
                  const isAbsent = absent.includes(student.enrollmentId);
                  const isTardy = student.enrollmentId in tardies;
                  const novelty = noveltyOf(student, isAbsent);
                  const showClock = !isAbsent && !(isClass && sheet.firstOfDay);

                  return (
                    <tr key={student.enrollmentId}>
                      <td>{student.name}</td>

                      <td className={page.cellTight}>
                        {novelty && <StatusMark label={novelty.label} color={novelty.color} />}
                      </td>

                      <td className={page.cellTight}>
                        <span className={styles.choice} role="group" aria-label={student.name}>
                          <button
                            type="button"
                            className={`${styles.choiceOption} ${isAbsent ? "" : styles.choicePresent}`}
                            aria-pressed={!isAbsent}
                            disabled={locked}
                            onClick={() => choose(student, false)}
                          >
                            Asistió
                          </button>
                          <button
                            type="button"
                            className={`${styles.choiceOption} ${isAbsent ? styles.choiceAbsent : ""}`}
                            aria-pressed={isAbsent}
                            disabled={locked}
                            onClick={() => choose(student, true)}
                          >
                            Inasistencia
                          </button>
                        </span>
                      </td>

                      <td className={page.cellTight}>
                        {showClock && (
                          <Tooltip title={isTardy ? "Quitar tardanza" : "Tardanza"}>
                            <span>
                              <IconButton
                                size="small"
                                color={isTardy ? "primary" : "default"}
                                disabled={locked}
                                onClick={() => toggleTardy(student)}
                              >
                                <AccessTimeIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={evasion !== null} onClose={() => setEvasion(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Posible evasión</DialogTitle>

        <DialogContent>
          {evasion && `${evasion.name} asistió a ${evasion.earlierClass}. La falta se registrará como evasión.`}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEvasion(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              markAbsent(evasion);
              setEvasion(null);
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={tardy !== null} onClose={() => setTardy(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Tardanza</DialogTitle>

        <DialogContent>
          {tardy?.student.name}

          <TextField
            label="Sanción pedagógica"
            multiline
            minRows={2}
            fullWidth
            required
            value={tardy?.text ?? ""}
            onChange={(event) =>
              setTardy((current) => ({ ...current, text: event.target.value.slice(0, OBSERVATION_LIMIT) }))
            }
            sx={{ marginTop: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setTardy(null)}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!tardy?.text.trim()}
            onClick={() => {
              setTardies((current) => ({ ...current, [tardy.student.enrollmentId]: tardy.text.trim() }));
              setTardy(null);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RollSheet;
