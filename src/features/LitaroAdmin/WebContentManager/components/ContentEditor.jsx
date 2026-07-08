import {
  Drawer,
  Box,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const ContentEditor = ({
  open,
  content,
  form = {},
  setForm,
  onClose,
  onSave,
}) => {
  const getFieldProps = (key, value) => {
    const lower = key.toLowerCase();

    if (lower.includes("email")) {
      return { type: "email" };
    }

    if (lower.includes("date")) {
      return {
        type: "date",
        InputLabelProps: {
          shrink: true,
        },
      };
    }

    if (lower.includes("color")) {
      return {
        type: "color",
        InputLabelProps: {
          shrink: true,
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
      multiline: typeof value === "string" && value.length > 80,
      minRows: 4,
    };
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          p: 3,
        }}
      >
        <Typography variant="h5" mb={3}>
          {content?.webContentId ? "Editar contenido" : "Nuevo contenido"}
        </Typography>

        <Stack spacing={2}>
          {Object.entries(form ?? {}).map(([key, value]) => (
            <TextField
              key={key}
              label={key}
              value={value ?? ""}
              fullWidth
              {...getFieldProps(key, value)}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]:
                    typeof value === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={() => onSave(form)}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default ContentEditor;
