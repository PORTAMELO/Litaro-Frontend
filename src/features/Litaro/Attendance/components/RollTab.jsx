import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Attendance.module.css";
import * as service from "../services/AttendanceService";
import { formatTime, slotKey } from "../utils/AttendanceUtils";
import RollSheet from "./RollSheet";

const RollTab = ({ options, can, notify }) => {
  const canEditAny = can("AttendanceRoll", "update");

  const [date, setDate] = useState(options.today);
  const [classroomId, setClassroomId] = useState("");
  const [chosenKey, setChosenKey] = useState(null);

  const { data, error, loading, reload } = useLoad(() => service.getAgenda(date, classroomId), [date, classroomId]);

  const agenda = data ?? [];
  const chosen = agenda.find((item) => slotKey(item) === chosenKey) ?? agenda.find((item) => !item.taken) ?? agenda[0];

  const changeDate = (value) => {
    if (!value || value > options.today) return;

    setDate(value);
    setChosenKey(null);
  };

  return (
    <>
      <div className={page.header}>
        <div className={page.headerActions}>
          {canEditAny && (
            <TextField
              select
              size="small"
              value={classroomId}
              onChange={(event) => {
                setClassroomId(event.target.value);
                setChosenKey(null);
              }}
              slotProps={{ select: { displayEmpty: true }, htmlInput: { "aria-label": "Curso" } }}
              sx={{ minWidth: "10rem" }}
            >
              <MenuItem value="">Mis clases</MenuItem>
              {options.classrooms.map((classroom) => (
                <MenuItem key={classroom.classroomId} value={classroom.classroomId}>
                  {classroom.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        <TextField
          type="date"
          size="small"
          value={date}
          onChange={(event) => changeDate(event.target.value)}
          slotProps={{ htmlInput: { max: options.today, "aria-label": "Fecha" } }}
        />
      </div>

      {error && <p className={page.message}>{error}</p>}

      {!error && !data && loading && <p className={page.message}>Cargando…</p>}

      {!error && data && agenda.length === 0 && (
        <div className={page.card}>
          <EmptyState title="Sin clases este día" />
        </div>
      )}

      {agenda.length > 0 && (
        <div className={styles.classGrid}>
          {agenda.map((item) => {
            const key = slotKey(item);
            const isChosen = chosen && slotKey(chosen) === key;

            return (
              <button
                type="button"
                key={key}
                className={`${styles.classCard} ${isChosen ? styles.classCardActive : ""}`}
                aria-pressed={Boolean(isChosen)}
                onClick={() => setChosenKey(key)}
              >
                <span>
                  <span className={styles.classTime}>{item.startTime ? formatTime(item.startTime) : "Todo el día"}</span>
                  <span className={styles.classMeta}>
                    {item.subjectName ? `${item.subjectName} · ${item.classroomName}` : item.classroomName}
                  </span>
                </span>

                {item.taken && <CheckIcon className={styles.classTaken} aria-label="Lista tomada" />}
                {!item.taken && isChosen && <span className={styles.classPending} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      {chosen && (
        <RollSheet
          key={`${date}|${slotKey(chosen)}`}
          classroomId={chosen.classroomId}
          date={date}
          startTime={chosen.startTime}
          notify={notify}
          onSaved={reload}
        />
      )}
    </>
  );
};

export default RollTab;
