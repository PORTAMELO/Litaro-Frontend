import { useEffect, useRef, useState } from "react";
import { Button, Skeleton } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { useLoad } from "@/shared/hooks/useLoad";
import styles from "../Audit.module.css";
import * as service from "../services/AuditService";
import { eventLabel, formatDateTime, REASON_LABELS } from "../utils/AuditUtils";

const DATA_EVENTS = ["INSERT", "UPDATE", "DELETE"];

const subjectText = (summary) => {
  const table = summary.tableLabel || summary.tableName;

  if (!table) return "";

  return summary.recordId ? `${table} #${summary.recordId}` : table;
};

const titleText = (summary) => [eventLabel(summary), subjectText(summary)].filter(Boolean).join(" · ");

const LongText = ({ value }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const element = box.current;

    if (!element || expanded) return undefined;

    const measure = () => setOverflow(element.scrollHeight > element.clientHeight + 1);
    if (typeof ResizeObserver === "undefined") {
      measure();
      return undefined;
    }

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => observer.disconnect();
  }, [expanded, value]);

  return (
    <>
      <div ref={box} className={`${styles.value} ${expanded ? "" : styles.valueClamped}`}>
        {value}
      </div>

      {(overflow || expanded) && (
        <button type="button" className={styles.linkButton} onClick={() => setExpanded((current) => !current)}>
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </>
  );
};

const SideValue = ({ change, side }) => {
  const masked = side === "before" ? change.beforeMasked : change.afterMasked;
  const value = side === "before" ? change.before : change.after;

  if (masked) return <span className={styles.muted}>(oculto)</span>;
  if (value === null || value === undefined) return <span className={styles.muted}>—</span>;

  return <LongText value={String(value)} />;
};

const ChangesTable = ({ rows, sides }) => {
  const columns = sides === "both" ? 3 : 2;

  return (
    <div className={styles.changesWrapper}>
      <table className={styles.changes}>
        <thead>
          <tr>
            <th>Campo</th>
            {sides !== "after" && <th>Antes</th>}
            {sides !== "before" && <th>Después</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((change) =>
            change.column === "PasswordHash" && change.changed ? (
              <tr key={change.column}>
                <td>{change.label || change.column}</td>
                <td colSpan={columns - 1}>Contraseña modificada</td>
              </tr>
            ) : (
              <tr key={change.column}>
                <td>{change.label || change.column}</td>
                {sides !== "after" && (
                  <td>
                    <SideValue change={change} side="before" />
                  </td>
                )}
                {sides !== "before" && (
                  <td>
                    <SideValue change={change} side="after" />
                  </td>
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

const Block = ({ title, children }) => (
  <div className={styles.block}>
    <div className={styles.blockTitle}>{title}</div>
    <div>{children}</div>
  </div>
);

const documentText = (summary) => [summary.documentType, summary.fileName].filter(Boolean).join(" · ") || "—";

const DocumentBlocks = ({ summary, previous }) => (
  <>
    <Block title="Tipo">{summary.documentType || "—"}</Block>
    <Block title="Archivo">{summary.fileName || "—"}</Block>
    <Block title="Entidad">{summary.entityLabel || "—"}</Block>

    {summary.eventType === "DOC_REPLACE" && (
      <>
        <Block title="Anterior">{previous ? documentText(previous) : "—"}</Block>
        <Block title="Nuevo">{documentText(summary)}</Block>
      </>
    )}

    {summary.moved && (
      <>
        <Block title="Desde">{summary.movedFromLabel || "—"}</Block>
        <Block title="Hacia">{summary.entityLabel || "—"}</Block>
      </>
    )}
  </>
);

const AccessBlocks = ({ summary, detail }) => (
  <>
    <Block title="Resultado">{eventLabel(summary)}</Block>
    <Block title="Motivo">{summary.reason ? (REASON_LABELS[summary.reason] ?? summary.reason) : "—"}</Block>
    <Block title="IP">{summary.ipAddress || "—"}</Block>
    <Block title="Navegador">{detail.userAgent ? <LongText value={detail.userAgent} /> : "—"}</Block>
  </>
);

const DataBlock = ({ summary, detail }) => {
  const [showAll, setShowAll] = useState(false);
  const isUpdate = summary.eventType === "UPDATE";
  const canToggle = isUpdate && (detail.allFields?.length ?? 0) > 0;
  const rows = (isUpdate && showAll ? detail.allFields : detail.changes) ?? [];
  const sides = summary.eventType === "INSERT" ? "after" : summary.eventType === "DELETE" ? "before" : "both";

  return (
    <>
      {rows.length > 0 ? <ChangesTable rows={rows} sides={sides} /> : <p className={page.message}>Sin campos para mostrar.</p>}

      {canToggle && (
        <div>
          <Button size="small" onClick={() => setShowAll((current) => !current)}>
            {showAll ? "Ver solo los cambios" : "Ver todos los campos"}
          </Button>
        </div>
      )}
    </>
  );
};

const Related = ({ related, onOpen }) => {
  if (related.length === 0) return null;

  return (
    <div className={styles.related}>
      <div className={styles.sectionTitle}>Otros cambios de la misma operación ({related.length})</div>

      <ul className={styles.relatedList}>
        {related.map((item) => (
          <li key={item.id}>
            <button type="button" className={styles.relatedItem} onClick={() => onOpen(item.id)}>
              <span>{[eventLabel(item), subjectText(item) || item.documentType].filter(Boolean).join(" · ")}</span>
              <span className={styles.muted}>{formatDateTime(item.occurredAt)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Detail = ({ detail, onOpen, onShowHistory }) => {
  const { summary } = detail;
  const isData = DATA_EVENTS.includes(summary.eventType);
  const isAccess = !isData && summary.tableName === "Auth";
  const previousId = summary.eventType === "DOC_REPLACE" ? detail.previousDocument?.id : undefined;
  const related = (detail.related ?? []).filter((item) => item.id !== previousId);

  return (
    <>
      {isData && <DataBlock key={summary.id} summary={summary} detail={detail} />}

      {isAccess && <AccessBlocks summary={summary} detail={detail} />}

      {!isData && !isAccess && <DocumentBlocks summary={summary} previous={detail.previousDocument} />}

      <Related related={related} onOpen={onOpen} />

      {isData && summary.recordId && (
        <div>
          <Button size="small" onClick={() => onShowHistory(summary.tableName, summary.recordId)}>
            Ver historial de este registro
          </Button>
        </div>
      )}
    </>
  );
};

const AuditDetailPanel = ({ id, notify, onClose, onOpen, onShowHistory }) => {
  const { data, error } = useLoad(() => service.getEvent(id), [id], id !== null);

  useEffect(() => {
    if (error) notify(error, "error");
  }, [error, notify]);

  const detail = data?.summary?.id === id ? data : null;
  const summary = detail?.summary;

  const subtitle = summary
    ? [formatDateTime(summary.occurredAt), summary.actor, summary.ipAddress, summary.source].filter(Boolean).join(" · ")
    : undefined;

  return (
    <SidePanel
      open={id !== null}
      title={summary ? titleText(summary) : "Detalle del evento"}
      subtitle={subtitle}
      onClose={onClose}
    >
      {error && <p className={page.message}>{error}</p>}

      {!error && !detail && (
        <div role="status" aria-label="Cargando">
          <Skeleton variant="rounded" height={20} width="60%" />
          <Skeleton variant="rounded" height={120} sx={{ mt: 2 }} />
        </div>
      )}

      {!error && detail && <Detail detail={detail} onOpen={onOpen} onShowHistory={onShowHistory} />}
    </SidePanel>
  );
};

export default AuditDetailPanel;
