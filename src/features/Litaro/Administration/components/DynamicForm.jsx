import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";

const DynamicForm = ({ open, title, schema, record, onClose }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (record) {
      const initialForm = {};

      schema.forEach((column) => {
        const fieldName = column.columnName.charAt(0).toLowerCase() + column.columnName.slice(1);

        initialForm[fieldName] = record[fieldName] ?? "";
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
    } else {
      setForm({});
    }
  }, [record, schema]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const getFieldName = (columnName) => {
    return columnName.charAt(0).toLowerCase() + columnName.slice(1);
  };

  const getInputType = (dataType) => {
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

      default:
        return "text";
    }
  };

  const isPrimaryKey = (column) => {
    return column.columnName.toLowerCase().endsWith("id");
  };

  const isBoolean = (column) => {
    return column.dataType === "boolean";
  };

  const visibleSchema = schema.filter((column) => !isPrimaryKey(column) && column.columnName !== "CreationDate");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: "var(--space-lg)",
          pt: "var(--space-lg)",
          pb: "var(--space-sm)",
          fontFamily: "Nunito, sans-serif",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--font-bold)",
          color: "var(--color-text)",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          px: "var(--space-lg)",
          py: "var(--space-md)",
        }}
      >
        <Stack spacing={1.5}>
          {visibleSchema.map((column) => {
            const field = getFieldName(column.columnName);
            const value = form[field];

            if (isBoolean(column)) {
              return (
                <FormControlLabel
                  key={column.columnName}
                  control={
                    <Switch checked={Boolean(value)} onChange={(event) => handleChange(field, event.target.checked)} />
                  }
                  label={column.columnName}
                />
              );
            }

            return (
              <TextField
                key={column.columnName}
                label={column.columnName}
                value={value ?? ""}
                type={getInputType(column.dataType)}
                fullWidth
                size="small"
                onChange={(event) => handleChange(field, event.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: getInputType(column.dataType) === "date" || getInputType(column.dataType) === "datetime-local",
                  },
                }}
              />
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: "var(--space-lg)",
          pb: "var(--space-lg)",
          gap: "var(--space-xs)",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: "var(--radius-md)",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: "var(--font-semibold)",
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: "var(--radius-md)",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: "var(--font-semibold)",
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicForm;
