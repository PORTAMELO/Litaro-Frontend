import { useState, useEffect, useMemo } from "react";
import { Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Button, Stack, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import ColumnFilterConfig from "./ColumnFilterConfig";
import RecordsFilterForm from "./RecordsFilterForm";

const getColumnType = (dataType) => {
  switch (dataType) {
    case "smallint":
    case "integer":
    case "bigint":
    case "numeric":
    case "decimal":
    case "real":
    case "double precision":
      return "number";

    case "date":
      return "date";

    case "timestamp with time zone":
    case "timestamp without time zone":
      return "dateTime";

    case "boolean":
      return "boolean";

    default:
      return "string";
  }
};

const toCamel = (columnName) => columnName.charAt(0).toLowerCase() + columnName.slice(1);

const getRawValue = (row, key) => (row?.[key] !== undefined ? row[key] : row?.user?.[key]);

const RecordsTable = ({
  open,
  title,
  tableName,
  rows,
  schema,
  loading,
  onClose,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onQuery,
  onSchemaChange,
  lookups,
  hideCreate,
  roleFields,
}) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);

  useEffect(() => {
    setHasQueried(false);
  }, [tableName]);

  const primaryKeyColumn = schema?.find((column) => column.columnName.toLowerCase().endsWith("id"));

  const primaryKeyField = primaryKeyColumn
    ? primaryKeyColumn.columnName.charAt(0).toLowerCase() + primaryKeyColumn.columnName.slice(1)
    : null;

  const filterableColumns = useMemo(
    () =>
      (schema ?? [])
        .filter((column) => column.filterable)
        .map((column) => ({
          field: column.columnName.charAt(0).toLowerCase() + column.columnName.slice(1),
          columnName: column.columnName,
          alias: column.alias,
          dataType: column.dataType,
        })),
    [schema]
  );

  const hasFilters = filterableColumns.length > 0;
  const canShowGrid = !hasFilters || hasQueried;

  const handleQuery = (filters) => {
    onQuery?.(filters);
    setHasQueried(true);
  };

  const buildColumn = (key, columnSchema) => {
    const type = getColumnType(columnSchema.dataType);
    const headerName = columnSchema.alias || columnSchema.columnName;
    const lookup = lookups?.[key];

    return {
      field: key,
      headerName,
      flex: 1,
      minWidth: 120,
      type,
      filterable: false,

      valueGetter: (_value, row) => {
        const raw = getRawValue(row, key);

        if (lookup) return lookup[String(raw)] ?? raw;
        if (type === "date" || type === "dateTime") return raw ? new Date(raw) : raw;

        return raw;
      },

      ...(key === "active" && {
        renderCell: ({ row }) => (
          <Chip label={row.active ? "Activo" : "Inactivo"} color={row.active ? "success" : "error"} size="small" />
        ),
      }),
    };
  };

  const columns = roleFields
    ? roleFields
      .filter((field) => field.type !== "password")
      .map((field) => {
        const columnSchema = schema?.find((c) => toCamel(c.columnName) === field.name);

        if (!columnSchema) return null;
        if (columnSchema.visible === false) return null;

        return buildColumn(field.name, columnSchema);
      })
      .filter(Boolean)
    : rows.length > 0
      ? Object.keys(rows[0])
        .map((key) => {
          const columnSchema = schema?.find((c) => toCamel(c.columnName) === key);

          if (!columnSchema) return null;
          if (columnSchema.visible === false) return null;

          return buildColumn(key, columnSchema);
        })
        .filter(Boolean)
      : [];

  columns.push({
    field: "actions",
    headerName: "Acciones",
    width: 220,
    sortable: false,
    filterable: false,

    renderCell: ({ row }) => (
      <>
        <Tooltip title="Editar">
          <IconButton color="primary" onClick={() => onEdit?.(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        {row.active !== undefined &&
          (row.active ? (
            <Tooltip title="Desactivar">
              <IconButton color="warning" onClick={() => onDeactivate?.(row)}>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar">
              <IconButton color="success" onClick={() => onActivate?.(row)}>
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          ))}

        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => onDelete?.(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mb: 1.5 }}>
          <Tooltip title="Configurar filtros">
            <IconButton onClick={() => setConfigOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {!hideCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreate}
              size="small"
              sx={{
                borderRadius: "var(--radius-md)",
                textTransform: "none",
                fontFamily: "inherit",
                fontWeight: "var(--font-semibold)",
              }}
            >
              Nuevo
            </Button>
          )}
        </Stack>

        {hasFilters && (
          <RecordsFilterForm
            columns={filterableColumns}
            resetKey={tableName}
            onQuery={handleQuery}
            loading={loading}
          />
        )}

        {canShowGrid ? (
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            getRowId={(row) => row[primaryKeyField]}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-sm)",
              backgroundColor: "var(--background-color)",

              "& .MuiDataGrid-columnHeaders": {
                minHeight: "2.8rem !important",
                maxHeight: "2.8rem !important",
                backgroundColor: "rgba(22, 17, 58, 0.04)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontFamily: "Nunito, sans-serif",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-bold)",
                color: "var(--color-text)",
              },

              "& .MuiDataGrid-cell": {
                fontFamily: "Nunito, sans-serif",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
              },

              "& .MuiDataGrid-row": {
                minHeight: "3.2rem !important",
                maxHeight: "3.2rem !important",
              },

              "& .MuiDataGrid-footerContainer": {
                minHeight: "3rem",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              },

              "& .MuiTablePagination-root": {
                fontFamily: "Nunito, sans-serif",
                fontSize: "var(--text-sm)",
              },
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            Diligencia los filtros y presiona "Consultar" para ver los registros.
          </Typography>
        )}
      </DialogContent>

      <ColumnFilterConfig
        open={configOpen}
        tableName={tableName}
        onClose={() => setConfigOpen(false)}
        onSaved={onSchemaChange}
      />
    </Dialog>
  );
};

export default RecordsTable;