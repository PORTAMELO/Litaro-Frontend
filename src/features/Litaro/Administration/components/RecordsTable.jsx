import { Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Button, Stack } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";

const RecordsTable = ({ open, title, rows, schema, onClose, onCreate, onEdit, onDelete, onActivate, onDeactivate }) => {
  const primaryKeyColumn = schema?.find((column) => column.columnName.toLowerCase().endsWith("id"));

  const primaryKeyField = primaryKeyColumn
    ? primaryKeyColumn.columnName.charAt(0).toLowerCase() + primaryKeyColumn.columnName.slice(1)
    : null;

  const columns =
    rows.length > 0
      ? Object.keys(rows[0])
          .filter((key) => key !== primaryKeyField)
          .map((key) => ({
            field: key,
            headerName: key,
            flex: 1,
            minWidth: 120,

            ...(key === "active" && {
              renderCell: ({ row }) => (
                <Chip label={row.active ? "Activo" : "Inactivo"} color={row.active ? "success" : "error"} size="small" />
              ),
            }),
          }))
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
        <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 1.5 }}>
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
        </Stack>
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
      </DialogContent>
    </Dialog>
  );
};

export default RecordsTable;
