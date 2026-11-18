import styles from "../Observations.module.css";
import page from "@/shared/components/Ui/Page.module.css";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { TableSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import { formatDate } from "@/shared/utils/Dates";
import * as service from "../services/ObservationService";
import { commitmentLabel, kindLabel } from "../utils/ObservationUtils";

const COUNTS = [
  { key: "typeI", label: "Tipo I" },
  { key: "typeII", label: "Tipo II" },
  { key: "typeIII", label: "Tipo III" },
  { key: "academic", label: "Académicas" },
  { key: "total", label: "Total" },
];

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

// "2 compromisos: 1 cumplido, 1 pendiente".
const commitmentSummary = ({ total, pending, met, notMet, observation }) => {
  if (total === 0) return "Sin compromisos";

  const parts = [
    met && plural(met, "cumplido", "cumplidos"),
    pending && plural(pending, "pendiente", "pendientes"),
    notMet && `${notMet} no ${notMet === 1 ? "cumplido" : "cumplidos"}`,
    observation && `${observation} con observación`,
  ].filter(Boolean);

  return `${plural(total, "compromiso", "compromisos")}: ${parts.join(", ")}`;
};

// Ficha del estudiante en el año: todas sus observaciones, de todos los docentes, en orden cronológico.
const ConsolidatedPanel = ({ studentId, yearId, onClose }) => {
  const { data, error } = useLoad(() => service.getConsolidated(studentId, yearId), [studentId, yearId]);
  const reached = data && data.counts.typeI >= data.threshold;

  return (
    <SidePanel
      open
      title={data?.studentName ?? "Consolidado"}
      subtitle={data ? `${data.classroomName} · ${data.campusName} · ${data.yearId} · Doc. ${data.documentNumber}` : null}
      onClose={onClose}
    >
      {error && <p className={page.message}>{error}</p>}

      {!error && !data && <TableSkeleton rows={5} columns={2} />}

      {data && (
        <div className={page.formStack}>
          <section className={styles.detailSection}>
            <dl className={styles.counts}>
              {COUNTS.map((item) => (
                <div key={item.key} className={item.key === "typeI" && reached ? styles.countAlert : styles.count}>
                  <dt>{item.label}</dt>
                  <dd>{data.counts[item.key]}</dd>
                </div>
              ))}
            </dl>

            {reached && (
              <div className={`${page.notice} ${page.noticeError}`}>
                Alcanzó {data.counts.typeI} situaciones Tipo I (alerta desde {data.threshold}).
              </div>
            )}

            <p className={page.secondaryText}>{commitmentSummary(data.commitments)}</p>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Observaciones del año</h3>

            {data.observations.length === 0 && <p className={page.secondaryText}>Sin observaciones en el año.</p>}

            <ol className={styles.timeline}>
              {data.observations.map((observation) => (
                <li key={observation.observationId} className={styles.commitment}>
                  <div className={styles.detailHead}>
                    <span className={page.chip}>{kindLabel(observation)}</span>
                    <span className={page.secondaryText}>{formatDate(observation.date)}</span>
                  </div>
                  <span className={page.secondaryText}>
                    {observation.recordedBy}
                    {observation.subjectName ? ` · ${observation.subjectName}` : ""}
                  </span>
                  <p className={styles.commitmentText}>{observation.description}</p>

                  {observation.statement && (
                    <p className={page.secondaryText}>Descargos: {observation.statement}</p>
                  )}

                  {observation.commitments.length > 0 && (
                    <ul className={styles.commitmentList}>
                      {observation.commitments.map((commitment) => (
                        <li key={commitment.commitmentId}>
                          {commitment.text} · <strong>{commitmentLabel(commitment.status)}</strong>
                          {commitment.note ? ` (${commitment.note})` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </SidePanel>
  );
};

export default ConsolidatedPanel;
