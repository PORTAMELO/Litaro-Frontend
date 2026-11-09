import { useState } from "react";
import { Button, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "./SidePanel";
import { Field } from "./Ui";

const DatesPanel = ({ yearId, period, onClose, onSaved }) => {
  const [dates, setDates] = useState({
    preEnrollmentStart: period?.preEnrollmentStart ?? "",
    preEnrollmentEnd: period?.preEnrollmentEnd ?? "",
    admissionStart: period?.admissionStart ?? "",
    admissionEnd: period?.admissionEnd ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const change = (field) => (event) => setDates((previous) => ({ ...previous, [field]: event.target.value }));
  const complete = Object.values(dates).every((value) => value !== "");

  const submit = async () => {
    if (dates.preEnrollmentEnd < dates.preEnrollmentStart) {
      setError("La prematrícula no puede terminar antes de empezar.");
      return;
    }

    if (dates.admissionEnd < dates.admissionStart) {
      setError("Las solicitudes no pueden terminar antes de empezar.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await service.savePeriod(yearId, dates);
      onSaved();
    } catch (err) {
      setError(err.message ?? "No fue posible guardar las fechas.");
      setSaving(false);
    }
  };

  const dateField = (label, field) => (
    <Field label={label}>
      <TextField type="date" size="small" value={dates[field]} onChange={change(field)} disabled={saving} />
    </Field>
  );

  return (
    <SidePanel
      open
      busy={saving}
      onClose={onClose}
      title="Fechas de matrícula"
      subtitle={`Año ${yearId}`}
      footer={
        <>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.panelActions}>
            <Button onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={submit} disabled={!complete || saving}>
              {saving ? "Guardando…" : "Guardar fechas"}
            </Button>
          </div>
        </>
      }
    >
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Prematrícula de antiguos</h3>
        <p className={styles.hint}>Las familias que no respondan antes de la fecha final pierden el cupo.</p>
        <div className={styles.formGrid}>
          {dateField("Desde", "preEnrollmentStart")}
          {dateField("Hasta", "preEnrollmentEnd")}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Solicitudes de nuevos</h3>
        <p className={styles.hint}>Solo se registran solicitudes de admisión dentro de estas fechas.</p>
        <div className={styles.formGrid}>
          {dateField("Desde", "admissionStart")}
          {dateField("Hasta", "admissionEnd")}
        </div>
      </section>
    </SidePanel>
  );
};

export default DatesPanel;
