import { useEffect, useRef, useState } from "react";
import { Autocomplete, MenuItem, TextField } from "@mui/material";

import { Field } from "../../../../shared/components/Ui/Ui";
import * as service from "../services/AuditService";
import styles from "../Audit.module.css";

const RecordField = ({ value, onCommit }) => {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    if (draft.trim() !== value) onCommit(draft.trim());
  };

  return (
    <TextField
      size="small"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") commit();
      }}
    />
  );
};

const AuditFilters = ({ tab, options, filters, onChange }) => {
  const [userOptions, setUserOptions] = useState([]);
  const [userText, setUserText] = useState("");
  const timer = useRef(null);
  const counter = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const findUsers = (text) => {
    const trimmed = text.trim();

    clearTimeout(timer.current);
    counter.current += 1;

    if (trimmed.length < 2) {
      setUserOptions([]);
      return;
    }

    const request = counter.current;

    timer.current = setTimeout(() => {
      service
        .searchUsers(trimmed)
        .then((found) => {
          if (request === counter.current) setUserOptions(found ?? []);
        })
        .catch(() => {
          if (request === counter.current) setUserOptions([]);
        });
    }, 250);
  };

  const eventTypes = options.eventTypes?.[tab.optionsKey] ?? [];

  return (
    <div className={styles.filters}>
      <Field label="Desde" className={styles.filterDate}>
        <TextField
          size="small"
          type="date"
          value={filters.from}
          onChange={(event) => onChange({ from: event.target.value })}
        />
      </Field>

      <Field label="Hasta" className={styles.filterDate}>
        <TextField
          size="small"
          type="date"
          value={filters.to}
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </Field>

      <Field label="Usuario" className={styles.filterWide}>
        <Autocomplete
          size="small"
          options={userOptions}
          value={filters.user}
          filterOptions={(list) => list}
          getOptionLabel={(user) => user.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={(_, text, reason) => {
            setUserText(text);
            if (reason === "input") findUsers(text);
            else {
              clearTimeout(timer.current);
              counter.current += 1;
              if (reason === "clear") setUserOptions([]);
            }
          }}
          onChange={(_, value) => onChange({ user: value })}
          noOptionsText={userText.trim().length < 2 ? "Escribe al menos 2 caracteres" : "Sin resultados"}
          renderInput={(params) => <TextField {...params} placeholder="Buscar…" />}
        />
      </Field>

      {tab.filters.includes("tableName") && (
        <Field label="Tabla" className={styles.filterWide}>
          <TextField
            select
            size="small"
            value={filters.tableName}
            onChange={(event) => onChange({ tableName: event.target.value })}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(options.tables ?? []).map((table) => (
              <MenuItem key={table.value} value={table.value}>
                {table.label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      )}

      {tab.filters.includes("eventType") && (
        <Field label={tab.eventTypeLabel} className={styles.filterWide}>
          <TextField
            select
            size="small"
            value={filters.eventType}
            onChange={(event) => onChange({ eventType: event.target.value })}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">Todas</MenuItem>
            {eventTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Field>
      )}

      {tab.filters.includes("recordId") && (
        <Field label="Registro" className={styles.filterNarrow}>
          <RecordField key={filters.recordId} value={filters.recordId} onCommit={(recordId) => onChange({ recordId })} />
        </Field>
      )}
    </div>
  );
};

export default AuditFilters;
