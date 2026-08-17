import { useState, useEffect, useCallback } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const ColorField = ({ label, value, onCommit }) => {
  const [localValue, setLocalValue] = useState(value || "#000000");

  useEffect(() => {
    setLocalValue(value || "#000000");
  }, [value]);

  return (
    <Stack spacing={0.5}>
      <label style={{ fontSize: "0.75rem", color: "rgba(0, 0, 0, 0.6)" }}>
        {label}
      </label>
      <input
        type="color"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onCommit(localValue)}
        style={{
          width: "100%",
          height: "2.5rem",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          padding: 2,
        }}
      />
    </Stack>
  );
};

const ContentEditor = ({ open, content, onClose, onSave }) => {
  const [form, setForm] = useState({});

  const [multilineKeys, setMultilineKeys] = useState({});

  useEffect(() => {
    if (content) {
      const parsed = JSON.parse(content.dataJson);
      setForm(parsed);

      const ml = {};
      Object.entries(parsed).forEach(([k, v]) => {
        ml[k] = typeof v === "string" && v.length > 80;
      });
      setMultilineKeys(ml);
    } else {
      setForm({});
      setMultilineKeys({});
    }
  }, [content]);

  const getFieldProps = (key, value, isMultilineByDefault) => {
    const lower = key.toLowerCase();

    if (lower.includes("email")) {
      return { type: "email" };
    }

    if (lower.includes("date")) {
      return {
        type: "date",
        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      };
    }

    if (lower.includes("image") || lower.includes("url")) {
      return {
        type: "text",
        placeholder: "URL o nombre de la imagen",
      };
    }

    if (typeof value === "number") {
      return {
        type: "number",
      };
    }

    return {
      multiline: isMultilineByDefault,
      minRows: 4,
    };
  };

  const handleChange = useCallback((key, newValue, isNumber) => {
    setForm((prev) => ({
      ...prev,
      [key]: isNumber ? Number(newValue) : newValue,
    }));
  }, []);

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
        {content?.webContentId ? "Editar contenido" : "Nuevo contenido"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: "var(--space-lg)",
          py: "var(--space-md)",
        }}
      >
        <Stack spacing={1.5}>
          {Object.entries(form ?? {}).map(([key, value]) => {
            if (key.toLowerCase().includes("color")) {
              return (
                <ColorField
                  key={key}
                  label={key}
                  value={value}
                  onCommit={(newValue) => handleChange(key, newValue, false)}
                />
              );
            }

            return (
              <TextField
                key={key}
                label={key}
                value={value ?? ""}
                fullWidth
                {...getFieldProps(key, value, multilineKeys[key])}
                onChange={(e) =>
                  handleChange(key, e.target.value, typeof value === "number")
                }
                size="small"
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
          onClick={() => onSave(form)}
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

export default ContentEditor;
