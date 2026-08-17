import { Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

const ContentTable = ({ rows, onEdit, onDelete, onActivate, onDeactivate }) => {
  const columns = [
    {
      field: "displayOrder",
      headerName: "Orden",
      width: 80,
    },

    {
      field: "contentKey",
      headerName: "Tipo",
      width: 140,
    },

    {
      field: "preview",
      headerName: "Vista previa",
      flex: 1,

      renderCell: ({ row }) => {
        const json = JSON.parse(row.dataJson);

        const title =
          json.title ?? json.name ?? json.description ?? "Sin contenido";

        const description =
          json.description && json.description !== title
            ? json.description
            : "";

        return (
          <div style={{ paddingTop: "var(--space-xs)" }}>
            <span style={{ fontWeight: "var(--font-regular)" }}>{title}</span>

            {description && (
              <>
                <br />
                <small style={{ color: "var(--color-muted)" }}>
                  {description.length > 70
                    ? description.substring(0, 70) + "..."
                    : description}
                </small>
              </>
            )}
          </div>
        );
      },
    },

    {
      field: "active",
      headerName: "Estado",
      width: 120,

      renderCell: ({ row }) => (
        <Chip
          label={row.active ? "Activo" : "Inactivo"}
          color={row.active ? "success" : "error"}
          size="small"
        />
      ),
    },

    {
      field: "actions",
      headerName: "Acciones",
      width: 220,
      sortable: false,

      renderCell: ({ row }) => (
        <>
          <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => onEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          {row.active ? (
            <Tooltip title="Desactivar">
              <IconButton color="warning" onClick={() => onDeactivate(row)}>
                <BlockIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activar">
              <IconButton color="success" onClick={() => onActivate(row)}>
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={() => onDelete(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      disableRowSelectionOnClick
      getRowId={(row) => row.webContentId}
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
  );
};

export default ContentTable;
