import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import styles from "./Ui.module.css";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import { useConfirm } from "@/shared/hooks/useConfirm";

export const ViewButton = ({ disabled, onClick }) => (
  <Tooltip title="Ver">
    <span>
      <IconButton aria-label="Ver" size="small" disabled={disabled} onClick={onClick}>
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </span>
  </Tooltip>
);

export const UploadButton = ({ replace, disabled, onFile, accept }) => (
  <Tooltip title={replace ? "Reemplazar" : "Cargar"}>
    <span>
      <IconButton aria-label={replace ? "Reemplazar" : "Cargar"} size="small" component="label" disabled={disabled}>
        <UploadFileOutlinedIcon fontSize="small" />
        <input
          type="file"
          accept={accept}
          className={styles.hiddenInput}
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            onFile(file);
          }}
        />
      </IconButton>
    </span>
  </Tooltip>
);

export const DeleteButton = ({ disabled, onConfirm, title, text }) => {
  const { ask, dialogProps } = useConfirm();

  return (
    <>
      <Tooltip title="Eliminar">
        <span>
          <IconButton
            aria-label="Eliminar"
            size="small"
            disabled={disabled}
            onClick={() => ask({ title, message: text, confirmText: "Eliminar", action: onConfirm })}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <ConfirmDialog {...dialogProps} />
    </>
  );
};
