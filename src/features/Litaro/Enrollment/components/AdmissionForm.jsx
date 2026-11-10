import { useState } from "react";
import { Button, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import { Field, FieldGroup } from "../../../../shared/components/Ui/Ui";
import { DOCUMENT_TYPES, todayInColombia } from "../utils/EnrollmentUtils";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  documentType: "TI",
  documentNumber: "",
  birthDate: "",
  gradeId: "",
  guardianName: "",
  guardianPhone: "",
  notes: "",
};

const REQUIRED = [
  "firstName",
  "lastName",
  "documentType",
  "documentNumber",
  "birthDate",
  "gradeId",
  "guardianName",
  "guardianPhone",
];

const AdmissionForm = ({ yearId, grades, onClose, onCreated }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [withNotes, setWithNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const change = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));
  const complete = REQUIRED.every((field) => String(form[field]).trim() !== "");

  const submit = async () => {
    setSaving(true);
    setError(null);

    try {
      await service.createAdmission({
        ...form,
        yearId: Number(yearId),
        gradeId: Number(form.gradeId),
        notes: form.notes.trim() === "" ? null : form.notes.trim(),
      });
      onCreated();
    } catch (err) {
      setError(err.message ?? "No fue posible registrar la solicitud.");
      setSaving(false);
    }
  };

  return (
    <SidePanel
      open
      busy={saving}
      onClose={onClose}
      title="Nueva solicitud"
      subtitle={`Admisión para ${yearId}`}
      footer={
        <>
          {error && <p className={styles.error}>{error}</p>}
          <div className={ui.panelActions}>
            <Button onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={submit} disabled={!complete || saving}>
              {saving ? "Guardando…" : "Registrar solicitud"}
            </Button>
          </div>
        </>
      }
    >
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Aspirante</h3>

        <div className={styles.formGrid}>
          <Field label="Nombres">
            <TextField
              size="small"
              value={form.firstName}
              onChange={change("firstName")}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </Field>

          <Field label="Apellidos">
            <TextField
              size="small"
              value={form.lastName}
              onChange={change("lastName")}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </Field>

          <FieldGroup label="Documento" className={styles.span2}>
            <div className={styles.docRow}>
              <TextField
                select
                size="small"
                value={form.documentType}
                onChange={change("documentType")}
                slotProps={{ select: { native: true }, htmlInput: { "aria-label": "Tipo de documento" } }}
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </TextField>

              <TextField
                size="small"
                value={form.documentNumber}
                onChange={change("documentNumber")}
                slotProps={{ htmlInput: { maxLength: 20, "aria-label": "Número de documento" } }}
              />
            </div>
          </FieldGroup>

          <Field label="Fecha de nacimiento">
            <TextField
              type="date"
              size="small"
              value={form.birthDate}
              onChange={change("birthDate")}
              slotProps={{ htmlInput: { max: todayInColombia() } }}
            />
          </Field>

          <Field label="Grado">
            <TextField
              select
              size="small"
              value={form.gradeId}
              onChange={change("gradeId")}
              slotProps={{ select: { native: true } }}
            >
              <option value="">Elegir</option>
              {grades.map((grade) => (
                <option key={grade.gradeId} value={grade.gradeId}>
                  {grade.name}
                </option>
              ))}
            </TextField>
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Acudiente</h3>

        <div className={styles.formGrid}>
          <Field label="Nombre">
            <TextField
              size="small"
              value={form.guardianName}
              onChange={change("guardianName")}
              slotProps={{ htmlInput: { maxLength: 150 } }}
            />
          </Field>

          <Field label="Teléfono">
            <TextField
              size="small"
              value={form.guardianPhone}
              onChange={change("guardianPhone")}
              slotProps={{ htmlInput: { maxLength: 20, inputMode: "tel" } }}
            />
          </Field>
        </div>
      </section>

      {withNotes ? (
        <Field label="Observaciones">
          <TextField
            multiline
            minRows={3}
            value={form.notes}
            onChange={change("notes")}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </Field>
      ) : (
        <button
          type="button"
          className={styles.linkButton}
          style={{ alignSelf: "flex-start" }}
          onClick={() => setWithNotes(true)}
        >
          Agregar observaciones
        </button>
      )}
    </SidePanel>
  );
};

export default AdmissionForm;
