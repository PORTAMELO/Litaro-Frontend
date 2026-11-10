import { useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import page from "../../../../shared/components/Ui/Page.module.css";
import styles from "../Attendance.module.css";
import * as service from "../services/AttendanceService";

const WAIT_MS = 300;

const StudentSearch = ({ placeholder, actionLabel, busy = false, onPick }) => {
  const [text, setText] = useState("");
  const [found, setFound] = useState({ text: "", rows: [] });

  const wanted = text.trim();

  useEffect(() => {
    if (wanted.length < 2) return undefined;

    let cancelled = false;

    const timer = setTimeout(() => {
      service
        .searchStudents(wanted)
        .then((rows) => {
          if (!cancelled) setFound({ text: wanted, rows: rows ?? [] });
        })
        .catch(() => {
          if (!cancelled) setFound({ text: wanted, rows: [] });
        });
    }, WAIT_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [wanted]);

  const rows = wanted.length >= 2 && found.text === wanted ? found.rows : [];

  return (
    <>
      <div className={page.toolbar}>
        <TextField
          size="small"
          fullWidth
          placeholder={placeholder}
          value={text}
          onChange={(event) => setText(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": placeholder },
          }}
        />
      </div>

      {rows.length > 0 && (
        <ul className={styles.searchResults}>
          {rows.map((row) => (
            <li key={row.enrollmentId} className={styles.searchResult}>
              <span>
                {row.name}
                <span className={page.secondaryText}>
                  {row.classroomName} · {row.document}
                </span>
              </span>

              <Button
                variant="contained"
                size="small"
                disabled={busy}
                onClick={() => {
                  onPick(row);
                  setText("");
                }}
              >
                {actionLabel}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default StudentSearch;
