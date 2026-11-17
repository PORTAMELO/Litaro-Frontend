import { useState } from "react";
import { Button, Tab, Tabs, TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import ui from "../../../../shared/components/Ui/Ui.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "../../../../shared/components/Ui/SidePanel";
import { Field } from "../../../../shared/components/Ui/Ui";
import { C600Section, GuardianSection, StudentSection } from "./FormSections";
import DocumentChecklist from "./DocumentChecklist";
import { SECTION_LABELS, applyLookup, missingSections } from "../utils/EnrollmentForm";

const LOOKUP_MIN = 5;

const FormPanel = ({
  title,
  subtitle,
  options,
  initialForm,
  initialTab = "student",
  withGrade = true,
  withNotes = false,
  lockIdentity = false,
  guardianOptional = false,
  readOnly = false,
  checklist = null,
  documents = null,
  canManageDocuments = false,
  submitLabel,
  onSubmit,
  onChecklistChange,
  onClose,
  notify,
}) => {
  const [form, setForm] = useState(initialForm);
  const [tab, setTab] = useState(initialTab);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState({});
  const [looked, setLooked] = useState({});
  const [notesOpen, setNotesOpen] = useState(Boolean(initialForm.notes));

  const missing = missingSections(form, { guardianOptional, withGrade });

  const change = (section, field, value) =>
    setForm((previous) =>
      section === "root" ? { ...previous, [field]: value } : { ...previous, [section]: { ...previous[section], [field]: value } },
    );

  const lookup = async (section) => {
    const number = form[section].documentNumber.trim();
    if (number.length < LOOKUP_MIN || looked[section] === number) return;

    setLooked((previous) => ({ ...previous, [section]: number }));

    try {
      const person = await service.lookupPerson(number);

      if (person?.ambiguous) {
        setNotices((previous) => ({ ...previous, [section]: "Hay más de una persona con este documento." }));
      } else if (person?.found) {
        setForm((previous) => applyLookup(previous, section, person));
        setNotices((previous) => ({ ...previous, [section]: "Ya está en Litaro." }));
      } else {
        setNotices((previous) => ({ ...previous, [section]: null }));
      }
    } catch {
      setNotices((previous) => ({ ...previous, [section]: null }));
    }
  };

  const submit = async () => {
    setSaving(true);
    setError(null);

    try {
      await onSubmit(form);
    } catch (failure) {
      setError(failure.message ?? "No fue posible guardar.");
    } finally {
      setSaving(false);
    }
  };

  const tabLabel = (section) => (
    <span>
      {SECTION_LABELS[section]}
      {missing.includes(section) && <span className={styles.tabDot} aria-label="Incompleto" />}
    </span>
  );

  const documentsLabel = checklist ? `Documentos ${checklist.requiredLoaded}/${checklist.requiredTotal}` : "Documentos";

  const footer = (
    <>
      {error && <p className={styles.error}>{error}</p>}
      {!readOnly && missing.length > 0 && (
        <p className={styles.hint}>Falta completar: {missing.map((section) => SECTION_LABELS[section]).join(", ")}.</p>
      )}
      <div className={ui.panelActions}>
        <Button onClick={onClose} disabled={saving}>
          Cerrar
        </Button>
        {!readOnly && (
          <Button variant="contained" onClick={submit} disabled={missing.length > 0 || saving}>
            {saving ? "Guardando…" : submitLabel}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <SidePanel open busy={saving} onClose={onClose} title={title} subtitle={subtitle} footer={footer}>
      <Tabs
        className={styles.tabs}
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons={false}
      >
        <Tab value="student" label={tabLabel("student")} />
        <Tab value="guardian" label={tabLabel("guardian")} />
        <Tab value="c600" label={tabLabel("c600")} />
        <Tab value="documents" label={documentsLabel} disabled={!documents} />
      </Tabs>

      {tab === "student" && (
        <>
          <StudentSection
            form={form}
            onChange={change}
            options={options}
            withGrade={withGrade}
            lockIdentity={lockIdentity}
            onDocumentBlur={lockIdentity || readOnly ? undefined : () => lookup("student")}
            notice={notices.student}
          />

          {withNotes &&
            (notesOpen ? (
              <Field label="Observaciones">
                <TextField
                  multiline
                  minRows={3}
                  value={form.notes}
                  onChange={(event) => change("root", "notes", event.target.value)}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                />
              </Field>
            ) : (
              <button type="button" className={styles.linkButton} onClick={() => setNotesOpen(true)}>
                Agregar observaciones
              </button>
            ))}
        </>
      )}

      {tab === "guardian" && (
        <>
          {guardianOptional && <p className={styles.hint}>Opcional. Si lo llena, debe quedar completo.</p>}
          <GuardianSection
            form={form}
            onChange={change}
            options={options}
            onDocumentBlur={readOnly ? undefined : () => lookup("guardian")}
            notice={notices.guardian}
          />
        </>
      )}

      {tab === "c600" && <C600Section form={form} onChange={change} options={options} />}

      {tab === "documents" && documents && (
        <DocumentChecklist
          checklist={checklist}
          canManage={canManageDocuments}
          upload={documents.upload}
          remove={documents.remove}
          open={documents.open}
          onChange={onChecklistChange}
          notify={notify}
        />
      )}
    </SidePanel>
  );
};

export default FormPanel;
