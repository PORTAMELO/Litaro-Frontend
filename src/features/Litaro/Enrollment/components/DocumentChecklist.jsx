import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import styles from "../Enrollment.module.css";
import { DeleteButton, UploadButton, ViewButton } from "../../../../shared/components/Ui/FileButtons";
import { EmptyState } from "../../../../shared/components/Ui/Ui";
import { openBlob } from "../../../../shared/utils/Files";
import { formatDay } from "../utils/EnrollmentUtils";

const ACCEPT = "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";

const detailOf = (item) => {
  if (item.document) return `${item.document.fileName} · ${formatDay(item.document.uploadedAt)}`;
  if (!item.required) return "Opcional";

  return item.overdue ? "Obligatorio · vencido" : "Obligatorio";
};

const DocumentChecklist = ({ checklist, canManage, upload, remove, open, onChange, notify }) => {
  const [busy, setBusy] = useState(null);

  if (!checklist) return <p className={styles.hint}>Cargando…</p>;

  const run = async (detailId, action, success, failure) => {
    setBusy(detailId);

    try {
      const result = await action();
      if (result && result.items) onChange(result);
      if (success) notify(success);
    } catch (error) {
      notify(error.message ?? failure, "error");
    } finally {
      setBusy(null);
    }
  };

  const view = (detailId) =>
    run(detailId, async () => openBlob(await open(detailId)), null, "No fue posible abrir el documento.");

  const load = (detailId, file) => {
    if (!file) return;
    run(detailId, () => upload(detailId, file), "Documento cargado.", "No fue posible cargar el documento.");
  };

  const discard = (detailId) =>
    run(detailId, () => remove(detailId), "Documento eliminado.", "No fue posible eliminar el documento.");

  return (
    <section className={styles.section}>
      <div className={styles.checklistHeader}>
        <h3 className={styles.sectionTitle}>Documentos</h3>
        {checklist.dueDate && <span className={styles.secondaryText}>entrega hasta {formatDay(checklist.dueDate)}</span>}
      </div>

      {checklist.items.length === 0 ? (
        <EmptyState title="No hay documentos configurados" />
      ) : (
        <ul className={styles.checklist}>
          {checklist.items.map((item) => {
            const loaded = Boolean(item.document);
            const disabled = busy !== null;

            return (
              <li key={item.detailId} className={styles.checklistItem}>
                <span className={loaded ? styles.checkDone : styles.checkPending} aria-hidden="true">
                  {loaded ? <CheckCircleOutlineIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                </span>

                <span className={styles.checklistText}>
                  <span className={styles.checklistName}>{item.name}</span>
                  <span className={item.overdue ? styles.checklistOverdue : styles.secondaryText}>{detailOf(item)}</span>
                </span>

                <span className={styles.checklistActions}>
                  {loaded && <ViewButton disabled={disabled} onClick={() => view(item.detailId)} />}
                  {canManage && (
                    <UploadButton
                      replace={loaded}
                      accept={ACCEPT}
                      disabled={disabled}
                      onFile={(file) => load(item.detailId, file)}
                    />
                  )}
                  {canManage && loaded && (
                    <DeleteButton
                      title="Eliminar documento"
                      text="El documento quedará pendiente."
                      disabled={disabled}
                      onConfirm={() => discard(item.detailId)}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default DocumentChecklist;
