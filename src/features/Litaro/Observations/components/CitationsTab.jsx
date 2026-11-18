import { useState } from "react";
import { Button, IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import { EmptyState, SegmentedFilter, StatusMark, TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import { formatDate, formatDay, todayInColombia } from "@/shared/utils/Dates";
import * as service from "../services/ObservationService";
import {
  STATUS_OPTIONS,
  addDays,
  dayName,
  formatTime,
  missesText,
  mondayOf,
  plain,
  statusInfo,
  weekdayOf,
} from "../utils/CitationUtils";
import CitationCreatePanel from "./CitationCreatePanel";
import CitationPanel from "./CitationPanel";

const VIEWS = [
  { value: "list", label: "Lista" },
  { value: "week", label: "Semana" },
];

// Lunes a sábado: la jornada del colegio.
const WEEK_LENGTH = 6;

const CitationRow = ({ citation, onOpen }) => {
  const status = statusInfo(citation.status);

  return (
    <tr
      className={page.rowClickable}
      tabIndex={0}
      onClick={() => onOpen(citation)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(citation);
        }
      }}
    >
      <td className={page.cellTight}>
        {citation.scheduledDate ? (
          <>
            {formatDate(citation.scheduledDate)}
            <span className={page.secondaryText}>
              {dayName(weekdayOf(citation.scheduledDate))} {formatTime(citation.scheduledTime)}
            </span>
          </>
        ) : (
          <span className={page.secondaryText}>Sin fecha</span>
        )}
      </td>
      <td>
        {citation.studentName}
        <span className={page.secondaryText}>{citation.classroomName}</span>
      </td>
      <td>
        {citation.parentName ?? <span className={page.secondaryText}>Sin acudiente</span>}
        {citation.parentConsecutiveMisses > 0 && (
          <span className={styles.warningText}>{missesText(citation.parentConsecutiveMisses)}</span>
        )}
      </td>
      <td className={styles.descriptionCell}>
        {citation.reason}
        <span className={page.secondaryText}>{citation.origin === "AUTO" ? "Por observación" : "Manual"}</span>
      </td>
      <td>{citation.responsibleName}</td>
      <td>
        <StatusMark label={status.label} color={status.color} />
      </td>
    </tr>
  );
};

const WeekView = ({ monday, citations, today, onOpen }) => {
  const days = Array.from({ length: WEEK_LENGTH }, (_, index) => addDays(monday, index));

  return (
    <div className={styles.week}>
      {days.map((day) => {
        const items = citations
          .filter((citation) => citation.scheduledDate === day)
          .sort((a, b) => String(a.scheduledTime).localeCompare(String(b.scheduledTime)));

        return (
          <section key={day} className={`${styles.day} ${day === today ? styles.dayToday : ""}`}>
            <h3 className={styles.dayHead}>
              {dayName(weekdayOf(day))} <span>{formatDay(day)}</span>
            </h3>

            {items.length === 0 && <p className={page.secondaryText}>Sin citaciones</p>}

            {items.map((citation) => {
              const status = statusInfo(citation.status);

              return (
                <button key={citation.citationId} type="button" className={styles.event} onClick={() => onOpen(citation)}>
                  <span className={styles.eventTime}>{formatTime(citation.scheduledTime)}</span>
                  <span className={styles.eventStudent}>{citation.studentName}</span>
                  <span className={page.secondaryText}>{citation.responsibleName}</span>
                  <StatusMark label={status.label} color={status.color} />
                </button>
              );
            })}
          </section>
        );
      })}
    </div>
  );
};

const CitationsTab = ({ options, can, notify }) => {
  const today = todayInColombia();
  const canCreate = can("Citation", "create");
  const canUpdate = can("Citation", "update");

  const [view, setView] = useState("list");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [monday, setMonday] = useState(() => mondayOf(today));
  const [responsible, setResponsible] = useState("");
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);

  const range = view === "week" ? { from: monday, to: addDays(monday, WEEK_LENGTH - 1) } : { from, to };
  const filter = { status, ...range };

  const citations = useLoad(() => service.getCitations(filter), [JSON.stringify(filter)]);

  const all = citations.data ?? [];
  const responsibles = [...new Set(all.map((citation) => citation.responsibleName))].sort();
  const query = plain(text.trim());
  const rows = all.filter(
    (citation) =>
      (responsible === "" || citation.responsibleName === responsible) &&
      (plain(citation.studentName).includes(query) || plain(citation.parentName).includes(query)),
  );
  const pending = rows.filter((citation) => citation.status === "TO_SCHEDULE").length;

  return (
    <>
      <div className={page.card}>
        <div className={page.toolbar}>
          <SegmentedFilter label="Vista" options={VIEWS} value={view} onChange={setView} />

          <TextField
            select
            size="small"
            label="Estado"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={styles.filterField}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Atiende"
            value={responsible}
            onChange={(event) => setResponsible(event.target.value)}
            className={styles.filterField}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
          >
            <MenuItem value="">Todos</MenuItem>
            {responsibles.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          {view === "list" && (
            <>
              <TextField
                type="date"
                size="small"
                label="Desde"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                type="date"
                size="small"
                label="Hasta"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: from || undefined } }}
              />
            </>
          )}

          <TextField
            size="small"
            placeholder="Buscar estudiante o acudiente"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={styles.searchField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              htmlInput: { "aria-label": "Buscar estudiante o acudiente" },
            }}
          />

          {canCreate && options.classrooms.length > 0 && (
            <Button variant="contained" onClick={() => setCreating(true)}>
              Nueva citación
            </Button>
          )}
        </div>
      </div>

      <div className={page.card}>
        <div className={page.toolbar}>
          {view === "week" ? (
            <>
              <IconButton aria-label="Semana anterior" onClick={() => setMonday(addDays(monday, -7))}>
                <ChevronLeftIcon />
              </IconButton>
              <h2 className={page.toolbarTitle}>
                Semana del {formatDay(monday)} al {formatDate(addDays(monday, WEEK_LENGTH - 1))}
              </h2>
              <IconButton aria-label="Semana siguiente" onClick={() => setMonday(addDays(monday, 7))}>
                <ChevronRightIcon />
              </IconButton>
              <span className={page.toolbarSpacer} />
              {monday !== mondayOf(today) && <Button onClick={() => setMonday(mondayOf(today))}>Esta semana</Button>}
            </>
          ) : (
            <>
              <h2 className={page.toolbarTitle}>Citaciones</h2>
              {citations.data && (
                <span className={page.toolbarMeta}>
                  {rows.length}
                  {pending > 0 ? ` · ${pending} por agendar` : ""}
                </span>
              )}
            </>
          )}
        </div>

        {citations.error && <p className={page.message}>{citations.error}</p>}

        {!citations.error && !citations.data && <TableSkeleton rows={6} columns={5} />}

        {citations.data && view === "week" && (
          <WeekView monday={monday} citations={rows} today={today} onOpen={setSelected} />
        )}

        {citations.data && view === "list" && rows.length === 0 && (
          <EmptyState title="Sin citaciones" text="No hay citaciones con los filtros elegidos." />
        )}

        {citations.data && view === "list" && rows.length > 0 && (
          <div className={page.tableWrapper}>
            <table className={page.table}>
              <thead>
                <tr>
                  <th className={page.cellTight}>Fecha</th>
                  <th>Estudiante</th>
                  <th>Acudiente</th>
                  <th>Motivo</th>
                  <th>Atiende</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((citation) => (
                  <CitationRow key={citation.citationId} citation={citation} onOpen={setSelected} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && (
        <CitationCreatePanel
          classrooms={options.classrooms}
          notify={notify}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            citations.reload();
          }}
        />
      )}

      {selected && (
        <CitationPanel
          key={selected.citationId}
          citation={selected}
          canUpdate={canUpdate}
          notify={notify}
          onClose={() => setSelected(null)}
          onChanged={citations.reload}
        />
      )}
    </>
  );
};

export default CitationsTab;
