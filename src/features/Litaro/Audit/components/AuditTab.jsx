import { Button, Chip } from "@mui/material";

import page from "../../../../shared/components/Ui/Page.module.css";
import { EmptyState, TableSkeleton } from "../../../../shared/components/Ui/Ui";
import { useLoad } from "../../../../shared/hooks/UseLoad";
import styles from "../Audit.module.css";
import * as service from "../services/AuditService";
import { eventColor, eventLabel, TABS } from "../utils/AuditUtils";
import AuditFilters from "./AuditFilters";

const AuditTab = ({ category, options, notify, onOpen, selectedId, state, onState }) => {
  const tab = TABS.find((item) => item.value === category);
  const { filters, page: pageNumber } = state;

  const query = {
    category,
    from: filters.from,
    to: filters.to,
    userId: filters.user?.id,
    eventType: filters.eventType,
    tableName: filters.tableName,
    recordId: filters.recordId,
    page: pageNumber,
  };

  const { data, error, loading } = useLoad(async () => {
    try {
      return await service.getEvents(query);
    } catch (failure) {
      notify(failure.message ?? "No fue posible cargar la información.", "error");
      throw failure;
    }
  }, [query]);

  const rows = data?.items ?? [];

  const changeFilters = (patch) => onState({ filters: { ...filters, ...patch }, page: 1 });

  return (
    <div className={page.card}>
      <AuditFilters tab={tab} options={options} filters={filters} onChange={changeFilters} />

      {error && <p className={page.message}>{error}</p>}

      {!error && !data && <TableSkeleton rows={8} columns={tab.columns.length} />}

      {!error && data && rows.length === 0 && <EmptyState title="No hay eventos para estos filtros." />}

      {!error && rows.length > 0 && (
        <div className={page.tableWrapper}>
          <table className={page.table}>
            <thead>
              <tr>
                {tab.columns.map((column) => (
                  <th key={column.label}>{column.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${page.rowClickable} ${row.id === selectedId ? styles.rowSelected : ""}`}
                  tabIndex={0}
                  onClick={() => onOpen(row.id)}
                  role="button"
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpen(row.id);
                    }
                  }}
                >
                  {tab.columns.map((column) => (
                    <td key={column.label} className={column.tight ? page.cellTight : undefined}>
                      {column.chip ? (
                        <Chip size="small" variant="outlined" color={eventColor(row.eventType)} label={eventLabel(row)} />
                      ) : (
                        column.render(row)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!error && data && (pageNumber > 1 || data.hasMore) && (
        <div className={styles.pager}>
          <span className={styles.pageNumber}>Página {pageNumber}</span>
          <Button
            size="small"
            disabled={loading || pageNumber <= 1}
            onClick={() => onState({ filters, page: pageNumber - 1 })}
          >
            Anterior
          </Button>
          <Button
            size="small"
            disabled={loading || !data.hasMore}
            onClick={() => onState({ filters, page: pageNumber + 1 })}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditTab;
