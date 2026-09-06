import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import * as service from "../services/AdministrationService";

const ColumnFilterConfig = ({ open, tableName, onClose, onSaved }) => {
  const [columns, setColumns] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && tableName) {
      service.getColumnConfiguration(tableName).then((data) =>
        setColumns(
          data.map((c) => ({
            columnName: c.columnName,
            filterable: c.filterable,
            visible: c.visible,
            alias: c.alias ?? "",
            characteristicId: c.characteristicId ?? "",
          }))
        )
      );
    }
  }, [open, tableName]);

  useEffect(() => {
    if (open) {
      service.getCharacteristics().then(setCharacteristics);
    }
  }, [open]);

  const toggleFilterable = (columnName) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.columnName === columnName ? { ...c, filterable: !c.filterable } : c
      )
    );
  };

  const toggleVisible = (columnName) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.columnName === columnName ? { ...c, visible: !c.visible } : c
      )
    );
  };

  const changeAlias = (columnName, alias) => {
    setColumns((prev) =>
      prev.map((c) => (c.columnName === columnName ? { ...c, alias } : c))
    );
  };

  const changeCharacteristic = (columnName, characteristicId) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.columnName === columnName ? { ...c, characteristicId } : c
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = columns.map((c) => ({
        ...c,
        characteristicId: c.characteristicId === "" ? null : Number(c.characteristicId),
      }));

      await service.updateColumnConfiguration(tableName, payload);
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Configurar columnas — {tableName}</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} divider={<Divider flexItem />}>
          {columns.map((c) => (
            <Box key={c.columnName}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {c.columnName}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={c.filterable}
                      onChange={() => toggleFilterable(c.columnName)}
                    />
                  }
                  label="Filtrable"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={c.visible}
                      onChange={() => toggleVisible(c.columnName)}
                    />
                  }
                  label="Visible"
                />

                <TextField
                  label="Alias"
                  value={c.alias}
                  onChange={(event) => changeAlias(c.columnName, event.target.value)}
                  size="small"
                  sx={{ minWidth: 200 }}
                />

                <TextField
                  select
                  label="Depende de característica"
                  value={c.characteristicId}
                  onChange={(event) => changeCharacteristic(c.columnName, event.target.value)}
                  size="small"
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="">Ninguna (texto libre)</MenuItem>
                  {characteristics.map((ch) => (
                    <MenuItem key={ch.characteristicId} value={ch.characteristicId}>
                      {ch.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnFilterConfig;