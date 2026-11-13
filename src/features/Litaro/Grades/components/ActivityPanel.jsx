import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import { Field } from "../../../../shared/components/Ui/Ui";

const NAME_LIMIT = 150;
const TEXT_LIMIT = 1000;

const ActivityPanel = ({ activity, weighted, canDelete, onClose, onSave, onDelete }) => {
  const [values, setValues] = useState(() => ({
    name: activity?.name ?? "",
    description: activity?.description ?? "",
    competencies: activity?.competencies ?? "",
    weight: activity?.weight === null || activity?.weight === undefined ? "" : String(activity.weight),
  }));
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const weight = values.weight.trim() === "" ? null : Number(values.weight.replace(",", "."));
  const weightValid = !weighted || weight === null || (!Number.isNaN(weight) && weight > 0 && weight <= 100);
  const complete = values.name.trim() !== "" && weightValid;

  const change = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const run = async (action) => {
    setSaving(true);

    try {
      await action();
    } catch {
      setSaving(false);
    }
  };

  const save = () =>
    run(() =>
      onSave({
        name: values.name.trim(),
        description: values.description.trim() || null,
        competencies: values.competencies.trim() || null,
        weight: weighted ? weight : null,
      }),
    );

  return (
    <SidePanel
      open
      title={activity ? "Editar actividad" : "Nueva actividad"}
      busy={saving}
      onClose={onClose}
      footer={
        <div className={ui.panelActions}>
          {activity && canDelete && (
            <Button color="error" onClick={() => setConfirming(true)} disabled={saving}>
              Eliminar
            </Button>
          )}
          <span className={page.toolbarSpacer} />
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={save} disabled={saving || !complete}>
            Guardar
          </Button>
        </div>
      }
    >
      <div className={page.formStack}>
        <Field label="Nombre">
          <TextField
            size="small"
            fullWidth
            value={values.name}
            onChange={change("name")}
            slotProps={{ htmlInput: { maxLength: NAME_LIMIT } }}
          />
        </Field>

        <Field label="Descripción">
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={values.description}
            onChange={change("description")}
            slotProps={{ htmlInput: { maxLength: TEXT_LIMIT } }}
          />
        </Field>

        <Field label="Competencias o desempeños">
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={values.competencies}
            onChange={change("competencies")}
            slotProps={{ htmlInput: { maxLength: TEXT_LIMIT } }}
          />
        </Field>

        {weighted && (
          <Field label="Porcentaje">
            <TextField
              size="small"
              type="number"
              value={values.weight}
              error={!weightValid}
              onChange={change("weight")}
              slotProps={{ htmlInput: { min: 0.01, max: 100, step: 0.01 } }}
            />
          </Field>
        )}
      </div>

      <Dialog open={confirming} onClose={() => setConfirming(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar actividad</DialogTitle>
        <DialogContent>Se eliminarán sus notas.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirming(false);
              run(onDelete);
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </SidePanel>
  );
};

export default ActivityPanel;
