import { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const getFilterInputType = (dataType) => {
  switch (dataType) {
    case "integer":
    case "numeric":
    case "decimal":
    case "double precision":
      return "number";
    case "date":
      return "date";
    case "timestamp with time zone":
    case "timestamp without time zone":
      return "datetime-local";
    case "boolean":
      return "boolean";
    default:
      return "text";
  }
};

const RecordsFilterForm = ({ columns, onQuery, loading }) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    setValues({});
  }, [columns]);

  const handleChange = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", mb: 2 }} alignItems="center">
      {columns.map((column) => {
        const inputType = getFilterInputType(column.dataType);
        const value = values[column.field] ?? "";

        if (inputType === "boolean") {
          return (
            <TextField
              key={column.field}
              select
              label={column.alias || column.columnName}
              value={value}
              onChange={(event) => handleChange(column.field, event.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          );
        }

        return (
          <TextField
            key={column.field}
            label={column.alias || column.columnName}
            type={inputType}
            value={value}
            onChange={(event) => handleChange(column.field, event.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
            InputLabelProps={inputType !== "text" ? { shrink: true } : undefined}
          />
        );
      })}

      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        disabled={loading}
        onClick={() => onQuery(values)}
        sx={{
          borderRadius: "var(--radius-md)",
          textTransform: "none",
          fontFamily: "inherit",
          fontWeight: "var(--font-semibold)",
        }}
      >
        Consultar
      </Button>
    </Stack>
  );
};

export default RecordsFilterForm;