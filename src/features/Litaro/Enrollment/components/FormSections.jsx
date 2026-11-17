import { TextField } from "@mui/material";

import styles from "../Enrollment.module.css";
import { Field, FieldGroup } from "../../../../shared/components/Ui/Ui";
import { todayInColombia } from "../utils/EnrollmentUtils";
import { C600_FIELDS } from "../utils/EnrollmentForm";

const CatalogSelect = ({ options, value, onChange, showValue = false, label, disabled = false }) => {
  const list = options ?? [];
  const extra = value !== "" && !list.some((option) => option.value === value);

  return (
    <TextField
      select
      size="small"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ select: { native: true }, htmlInput: { "aria-label": label } }}
    >
      <option value="">Elegir</option>
      {extra && <option value={value}>{value}</option>}
      {list.map((option) => (
        <option key={option.value} value={option.value} title={option.label}>
          {showValue ? option.value : option.label}
        </option>
      ))}
    </TextField>
  );
};

const Input = ({ value, onChange, maxLength, label, htmlInput }) => (
  <TextField
    size="small"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{ htmlInput: { maxLength, "aria-label": label, ...htmlInput } }}
  />
);

const DocumentFields = ({ data, catalogs, onChange, onDocumentBlur, notice, locked }) => (
  <FieldGroup label="Documento" className={styles.span2}>
    <div className={styles.docRow}>
      <CatalogSelect
        label="Tipo de documento"
        options={catalogs?.documentTypes}
        value={data.documentType}
        showValue
        disabled={locked}
        onChange={(value) => onChange("documentType", value)}
      />

      <TextField
        size="small"
        value={data.documentNumber}
        disabled={locked}
        onChange={(event) => onChange("documentNumber", event.target.value)}
        onBlur={onDocumentBlur}
        slotProps={{ htmlInput: { maxLength: 20, "aria-label": "Número de documento" } }}
      />
    </div>
    {notice && <span className={styles.fieldNotice}>{notice}</span>}
  </FieldGroup>
);

export const StudentSection = ({ form, onChange, options, lockIdentity = false, withGrade = true, onDocumentBlur, notice }) => {
  const data = form.student;
  const catalogs = options?.catalogs;
  const set = (field, value) => onChange("student", field, value);

  return (
    <div className={styles.formGrid}>
      <DocumentFields
        data={data}
        catalogs={catalogs}
        onChange={set}
        onDocumentBlur={onDocumentBlur}
        notice={notice}
        locked={lockIdentity}
      />

      <Field label="Apellidos">
        <Input label="Apellidos" value={data.lastName} maxLength={100} onChange={(value) => set("lastName", value)} />
      </Field>

      <Field label="Nombres">
        <Input label="Nombres" value={data.firstName} maxLength={100} onChange={(value) => set("firstName", value)} />
      </Field>

      <Field label="Nacimiento">
        <TextField
          type="date"
          size="small"
          value={data.birthDate}
          onChange={(event) => set("birthDate", event.target.value)}
          slotProps={{ htmlInput: { max: todayInColombia(), "aria-label": "Fecha de nacimiento" } }}
        />
      </Field>

      <Field label="Género">
        <CatalogSelect label="Género" options={catalogs?.genders} value={data.gender} onChange={(value) => set("gender", value)} />
      </Field>

      <Field label="Tipo de sangre">
        <CatalogSelect
          label="Tipo de sangre"
          options={catalogs?.bloodTypes}
          value={data.bloodType}
          onChange={(value) => set("bloodType", value)}
        />
      </Field>

      <Field label="EPS">
        <CatalogSelect label="EPS" options={catalogs?.eps} value={data.eps} onChange={(value) => set("eps", value)} />
      </Field>

      <Field label="Correo" className={styles.span2}>
        <TextField
          size="small"
          type="email"
          placeholder="Opcional"
          value={data.email}
          onChange={(event) => set("email", event.target.value)}
          slotProps={{ htmlInput: { maxLength: 256, "aria-label": "Correo del estudiante" } }}
        />
      </Field>

      {withGrade && (
        <Field label="Grado">
          <TextField
            select
            size="small"
            value={form.gradeId}
            onChange={(event) => onChange("root", "gradeId", event.target.value)}
            slotProps={{ select: { native: true }, htmlInput: { "aria-label": "Grado" } }}
          >
            <option value="">Elegir</option>
            {(options?.grades ?? []).map((grade) => (
              <option key={grade.gradeId} value={grade.gradeId}>
                {grade.name}
              </option>
            ))}
          </TextField>
        </Field>
      )}

      <Field label="Sede" className={withGrade ? "" : styles.span2}>
        <TextField
          select
          size="small"
          value={data.campusId}
          onChange={(event) => set("campusId", event.target.value)}
          slotProps={{ select: { native: true }, htmlInput: { "aria-label": "Sede" } }}
        >
          <option value="">Elegir</option>
          {(options?.campuses ?? []).map((campus) => (
            <option key={campus.campusId} value={campus.campusId}>
              {campus.name}
            </option>
          ))}
        </TextField>
      </Field>
    </div>
  );
};

export const GuardianSection = ({ form, onChange, options, onDocumentBlur, notice }) => {
  const data = form.guardian;
  const catalogs = options?.catalogs;
  const set = (field, value) => onChange("guardian", field, value);

  return (
    <div className={styles.formGrid}>
      <DocumentFields
        data={data}
        catalogs={catalogs}
        onChange={set}
        onDocumentBlur={onDocumentBlur}
        notice={notice}
      />

      <Field label="Apellidos">
        <Input label="Apellidos del acudiente" value={data.lastName} maxLength={100} onChange={(value) => set("lastName", value)} />
      </Field>

      <Field label="Nombres">
        <Input label="Nombres del acudiente" value={data.firstName} maxLength={100} onChange={(value) => set("firstName", value)} />
      </Field>

      <Field label="Teléfono">
        <Input
          label="Teléfono"
          value={data.phone}
          maxLength={20}
          htmlInput={{ inputMode: "tel" }}
          onChange={(value) => set("phone", value)}
        />
      </Field>

      <Field label="Parentesco">
        <CatalogSelect
          label="Parentesco"
          options={catalogs?.relationships}
          value={data.relationship}
          onChange={(value) => set("relationship", value)}
        />
      </Field>

      <Field label="Dirección" className={styles.span2}>
        <Input label="Dirección" value={data.address} maxLength={200} onChange={(value) => set("address", value)} />
      </Field>

      <Field label="Correo" className={styles.span2}>
        <TextField
          size="small"
          type="email"
          value={data.email}
          onChange={(event) => set("email", event.target.value)}
          slotProps={{ htmlInput: { maxLength: 256, "aria-label": "Correo del acudiente" } }}
        />
      </Field>
    </div>
  );
};

export const C600Section = ({ form, onChange, options }) => (
  <div className={styles.stack}>
    {C600_FIELDS.map(({ field, catalog, label }) => (
      <Field key={field} label={label}>
        <CatalogSelect
          label={label}
          options={options?.catalogs?.[catalog]}
          value={form.c600[field]}
          onChange={(value) => onChange("c600", field, value)}
        />
      </Field>
    ))}
  </div>
);
