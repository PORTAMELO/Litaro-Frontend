import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import SidePanel from "@/shared/components/Ui/SidePanel";
import ui from "@/shared/components/Ui/Ui.module.css";
import { Field } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import * as service from "../services/ObservationService";
import { REASON_LIMIT } from "../utils/CitationUtils";

// Citación manual: sin observación previa. Quien la crea queda como responsable.
// `student` llega cuando se cita desde el Registro; si no, se elige curso y estudiante.
const CitationCreatePanel = ({ student: preset, classrooms, notify, onClose, onSaved }) => {
  const [classroomId, setClassroomId] = useState(classrooms[0]?.classroomId ?? "");
  const [studentId, setStudentId] = useState(preset?.studentId ?? "");
  const [parentId, setParentId] = useState(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const students = useLoad(() => service.getCitationStudents(classroomId), [classroomId], !preset && classroomId !== "");
  const parents = useLoad(() => service.getParents(studentId), [studentId], studentId !== "");

  const chosenParent = parentId ?? parents.data?.[0]?.parentId ?? "";
  const valid = studentId !== "" && reason.trim();

  const chooseClassroom = (value) => {
    setClassroomId(value);
    setStudentId("");
    setParentId(null);
  };

  const save = async () => {
    setSaving(true);

    try {
      await service.createCitation({
        studentId,
        parentId: chosenParent === "" ? null : chosenParent,
        reason: reason.trim(),
      });
      notify("Citación creada. Agéndela para notificar al acudiente.");
      onSaved();
    } catch (failure) {
      notify(failure.message ?? "No fue posible crear la citación.", "error");
      setSaving(false);
    }
  };

  return (
    <SidePanel
      open
      title="Nueva citación"
      subtitle={preset ? `${preset.studentName} · ${preset.classroomName}` : "Citación sin observación previa"}
      busy={saving}
      onClose={onClose}
      footer={
        <div className={ui.panelActions}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || !valid}>
            Crear citación
          </Button>
        </div>
      }
    >
      <div className={page.formStack}>
        {!preset && (
          <>
            <Field label="Curso">
              <TextField select size="small" value={classroomId} onChange={(event) => chooseClassroom(event.target.value)}>
                {classrooms.map((item) => (
                  <MenuItem key={item.classroomId} value={item.classroomId}>
                    {item.name} · {item.campusName}
                  </MenuItem>
                ))}
              </TextField>
            </Field>

            <Field label="Estudiante">
              <TextField
                select
                size="small"
                value={studentId}
                disabled={!students.data}
                onChange={(event) => {
                  setStudentId(event.target.value);
                  setParentId(null);
                }}
              >
                {(students.data ?? []).map((item) => (
                  <MenuItem key={item.studentId} value={item.studentId}>
                    {item.studentName}
                  </MenuItem>
                ))}
              </TextField>
            </Field>
          </>
        )}

        {studentId !== "" && parents.data?.length > 0 && (
          <Field label="Acudiente citado">
            <TextField select size="small" value={chosenParent} onChange={(event) => setParentId(event.target.value)}>
              {parents.data.map((parent) => (
                <MenuItem key={parent.parentId} value={parent.parentId}>
                  {parent.name} · {parent.relationship}
                  {parent.primaryContact ? " (principal)" : ""}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        )}

        {studentId !== "" && parents.data?.length === 0 && (
          <div className={page.notice}>El estudiante no tiene acudientes vinculados.</div>
        )}

        {parents.error && <div className={`${page.notice} ${page.noticeError}`}>{parents.error}</div>}

        <Field label="Motivo">
          <TextField
            multiline
            minRows={3}
            fullWidth
            placeholder="Ej.: hablar sobre la adaptación al curso"
            value={reason}
            onChange={(event) => setReason(event.target.value.slice(0, REASON_LIMIT))}
          />
        </Field>

        <div className={page.notice}>
          Usted queda como responsable. La citación se crea por agendar; el acudiente recibe la notificación al agendarla.
        </div>
      </div>
    </SidePanel>
  );
};

export default CitationCreatePanel;
