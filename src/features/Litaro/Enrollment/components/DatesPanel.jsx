import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as service from "../services/EnrollmentService";
import { todayInColombia } from "../utils/EnrollmentUtils";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import { Field } from "../../../../shared/components/Ui/Ui";

const DatesPanel = ({ yearId, period, pendingCount = 0, onClose, onSaved }) => {
  const [dates, setDates] = useState({
    preEnrollmentStart: period?.preEnrollmentStart ?? "",
    preEnrollmentEnd: period?.preEnrollmentEnd ?? "",
    admissionStart: period?.admissionStart ?? "",
    admissionEnd: period?.admissionEnd ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const change = (field) => (event) => setDates((previous) => ({ ...previous, [field]: event.target.value }));
  const complete = Object.values(dates).every((value) => value !== "");
  const expires = pendingCount > 0 && dates.preEnrollmentEnd !== "" && dates.preEnrollmentEnd < todayInColombia();

  const submit = async (confirmed = false) => {
    if (expires && !confirmed) {
      setConfirming(true);
      return;
    }

    setConfirming(false);

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
          <div className={ui.panelActions}>
            <Button onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => submit()} disabled={!complete || saving}>
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

      <Dialog open={confirming} onClose={() => setConfirming(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Plazo vencido</DialogTitle>
        <DialogContent>
          {pendingCount === 1
            ? "1 prematrícula sin respuesta perderá el cupo de inmediato."
            : `${pendingCount} prematrículas sin respuesta perderán el cupo de inmediato.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => submit(true)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </SidePanel>
  );
};

export default DatesPanel;
