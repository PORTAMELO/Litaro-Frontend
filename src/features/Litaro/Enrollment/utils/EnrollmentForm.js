export const SECTION_LABELS = {
  student: "Estudiante",
  guardian: "Acudiente",
  c600: "DANE C-600",
};

export const C600_FIELDS = [
  { field: "ethnicGroup", catalog: "ethnicGroups", label: "Grupo étnico" },
  { field: "disabilityType", catalog: "disabilityTypes", label: "Tipo de discapacidad" },
  { field: "exceptionalCapacity", catalog: "exceptionalCapacities", label: "Capacidades excepcionales" },
  { field: "conflictVictim", catalog: "conflictVictims", label: "Víctima del conflicto" },
  { field: "methodology", catalog: "methodologies", label: "Metodología" },
];

const STUDENT_FIELDS = [
  "documentType",
  "documentNumber",
  "firstName",
  "lastName",
  "birthDate",
  "gender",
  "bloodType",
  "eps",
  "email",
  "campusId",
];

const STUDENT_REQUIRED = STUDENT_FIELDS.filter((field) => field !== "email");

const GUARDIAN_FIELDS = ["documentType", "documentNumber", "firstName", "lastName", "phone", "address", "email", "relationship"];

const C600_KEYS = C600_FIELDS.map((item) => item.field);

const blankOf = (fields) => Object.fromEntries(fields.map((field) => [field, ""]));

export const EMPTY_FORM = {
  student: blankOf(STUDENT_FIELDS),
  guardian: blankOf(GUARDIAN_FIELDS),
  c600: blankOf(C600_KEYS),
  gradeId: "",
  notes: "",
};

const text = (value) => (value === null || value === undefined ? "" : String(value));

const filled = (value) => text(value).trim() !== "";

const plain = (value) =>
  text(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const pick = (options, value) => (options ?? []).some((option) => option.value === value);

export const withDefaults = (form, catalogs) => {
  const c600 = { ...form.c600 };

  C600_FIELDS.forEach(({ field, catalog }) => {
    if (filled(c600[field])) return;

    const none = (catalogs?.[catalog] ?? []).find((option) => plain(option.label) === "no aplica");
    if (none) c600[field] = none.value;
  });

  const student = { ...form.student };
  const guardian = { ...form.guardian };

  if (!filled(student.documentType) && pick(catalogs?.documentTypes, "TI")) student.documentType = "TI";
  if (!filled(guardian.documentType) && pick(catalogs?.documentTypes, "CC")) guardian.documentType = "CC";

  return { ...form, student, guardian, c600 };
};

export const isBlank = (section) => Object.values(section ?? {}).every((value) => !filled(value));

export const missingSections = (form, { guardianOptional = false, withGrade = true } = {}) => {
  const missing = [];

  const studentMissing =
    STUDENT_REQUIRED.some((field) => !filled(form.student[field])) || (withGrade && !filled(form.gradeId));

  if (studentMissing) missing.push("student");

  const guardianSkipped = guardianOptional && isBlank(form.guardian);
  if (!guardianSkipped && GUARDIAN_FIELDS.some((field) => !filled(form.guardian[field]))) missing.push("guardian");

  if (C600_KEYS.some((field) => !filled(form.c600[field]))) missing.push("c600");

  return missing;
};

const clean = (section) =>
  Object.fromEntries(
    Object.entries(section).map(([field, value]) => [field, filled(value) ? text(value).trim() : null]),
  );

export const toRequest = (form, yearId) => {
  const student = clean(form.student);
  const guardian = clean(form.guardian);

  return {
    yearId: Number(yearId),
    gradeId: Number(form.gradeId) || 0,
    student: { ...student, campusId: student.campusId === null ? null : Number(student.campusId) },
    guardian: isBlank(form.guardian) ? null : guardian,
    c600: clean(form.c600),
    notes: filled(form.notes) ? text(form.notes).trim() : null,
  };
};

const fill = (fields, source) => Object.fromEntries(fields.map((field) => [field, text(source?.[field])]));

export const fromDetail = (detail) => ({
  student: fill(STUDENT_FIELDS, detail.student),
  guardian: fill(GUARDIAN_FIELDS, detail.guardian),
  c600: fill(C600_KEYS, detail.c600),
  gradeId: text(detail.gradeId),
  notes: text(detail.summary?.notes),
});

const merge = (current, fields, source) => {
  const next = { ...current };

  fields.forEach((field) => {
    if (filled(source?.[field])) next[field] = text(source[field]);
  });

  return next;
};

export const applyLookup = (form, section, person) => {
  if (section === "guardian") {
    return { ...form, guardian: merge(form.guardian, GUARDIAN_FIELDS, person.guardian) };
  }

  return {
    ...form,
    student: merge(form.student, STUDENT_FIELDS, person.student),
    c600: person.c600 ? merge(form.c600, C600_KEYS, person.c600) : form.c600,
  };
};

export const optionLabel = (options, value) => {
  if (!filled(value)) return "—";

  return (options ?? []).find((option) => option.value === value)?.label ?? value;
};
