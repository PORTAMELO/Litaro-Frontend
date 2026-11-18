const TIME_ZONE = "America/Bogota";

export const EVENT_LABELS = {
  INSERT: "Creó",
  UPDATE: "Editó",
  DELETE: "Eliminó",
  LOGIN_OK: "Ingreso",
  LOGIN_FAIL: "Ingreso no completado",
  LOGOUT: "Salida",
  DOC_UPLOAD: "Carga",
  DOC_UPDATE: "Modificación",
  DOC_REPLACE: "Reemplazo",
  DOC_REPLACED: "Reemplazo",
  DOC_REMOVE: "Retiro",
  DOC_PURGE: "Purga de archivo",
};

export const REASON_LABELS = {
  USER_NOT_FOUND: "Usuario no existe",
  USER_INACTIVE: "Usuario inactivo",
  WRONG_PASSWORD: "Contraseña incorrecta",
  LOCKED_OUT: "Cuenta bloqueada",
  ACTIVATION_REQUIRED: "Cuenta sin activar",
  MUST_CHANGE_PASSWORD: "Debe cambiar la contraseña",
};

export const eventLabel = (summary) => {
  if (summary.eventType === "DOC_UPDATE") return summary.moved ? "Traslado" : "Modificación";

  return EVENT_LABELS[summary.eventType] ?? summary.eventType;
};

export const eventColor = (eventType) => {
  if (eventType === "DELETE" || eventType === "DOC_REMOVE" || eventType === "DOC_PURGE" || eventType === "LOGIN_FAIL") {
    return "error";
  }

  if (eventType === "INSERT" || eventType === "LOGIN_OK" || eventType === "DOC_UPLOAD") return "success";

  return "default";
};

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export const formatDateTime = (iso) => {
  if (!iso) return "—";

  const parts = Object.fromEntries(dateTimeFormat.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));

  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
};

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const todayInColombia = () => dayFormat.format(new Date());

export const shiftDay = (day, offset) => {
  const [year, month, date] = day.split("-").map(Number);
  const moved = new Date(Date.UTC(year, month - 1, date + offset));

  return moved.toISOString().slice(0, 10);
};

export const changesText = (labels) => {
  if (!labels || labels.length === 0) return "—";

  const shown = labels.slice(0, 2).join(", ");

  return labels.length > 2 ? `${shown} +${labels.length - 2}` : shown;
};

export const defaultFilters = () => {
  const to = todayInColombia();

  return { from: shiftDay(to, -6), to, user: null, eventType: "", tableName: "", recordId: "" };
};

export const initialTabState = () => ({ filters: defaultFilters(), page: 1 });

const actorText = (row) => row.actor || "—";

export const TABS = [
  {
    value: "data",
    label: "Cambios de datos",
    filters: ["tableName", "eventType", "recordId"],
    optionsKey: "data",
    eventTypeLabel: "Operación",
    columns: [
      { label: "Fecha y hora", render: (row) => formatDateTime(row.occurredAt), tight: true },
      { label: "Usuario", render: actorText },
      { label: "Operación", chip: true },
      { label: "Tabla", render: (row) => row.tableLabel || row.tableName },
      { label: "Registro", render: (row) => row.recordId ?? "—", tight: true },
      { label: "Cambios", render: (row) => changesText(row.changedLabels) },
    ],
  },
  {
    value: "access",
    label: "Accesos",
    filters: ["eventType"],
    optionsKey: "access",
    eventTypeLabel: "Resultado",
    columns: [
      { label: "Fecha y hora", render: (row) => formatDateTime(row.occurredAt), tight: true },
      { label: "Usuario / login", render: actorText },
      { label: "Resultado", chip: true },
      { label: "Motivo", render: (row) => (row.reason ? (REASON_LABELS[row.reason] ?? row.reason) : "—") },
      { label: "IP", render: (row) => row.ipAddress || "—", tight: true },
    ],
  },
  {
    value: "document",
    label: "Documentos",
    filters: ["eventType"],
    optionsKey: "document",
    eventTypeLabel: "Acción",
    columns: [
      { label: "Fecha y hora", render: (row) => formatDateTime(row.occurredAt), tight: true },
      { label: "Usuario", render: actorText },
      { label: "Acción", chip: true },
      {
        label: "Documento",
        render: (row) => [row.documentType, row.fileName].filter(Boolean).join(" · ") || "—",
      },
      { label: "Entidad", render: (row) => row.entityLabel || "—" },
    ],
  },
];
