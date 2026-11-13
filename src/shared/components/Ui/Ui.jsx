import { useId } from "react";
import { Skeleton } from "@mui/material";

import styles from "./Ui.module.css";

export const StatusMark = ({ label, color }) => (
  <span className={styles.status}>
    <span className={styles.dot} style={{ backgroundColor: color }} aria-hidden="true" />
    {label}
  </span>
);

export const SegmentedFilter = ({ label, options, value, onChange, className = "" }) => (
  <div className={`${styles.segment} ${className}`} role="group" aria-label={label}>
    {options.map((option) => (
      <button
        type="button"
        key={option.value}
        className={`${styles.segmentButton} ${option.value === value ? styles.segmentActive : ""}`}
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
        <span className={styles.segmentCount}>{option.count}</span>
      </button>
    ))}
  </div>
);

export const Field = ({ label, className = "", children }) => (
  <label className={`${styles.field} ${className}`}>
    <span className={styles.fieldLabel}>{label}</span>
    {children}
  </label>
);

export const FieldGroup = ({ label, className = "", children }) => {
  const id = useId();

  return (
    <div className={`${styles.field} ${className}`} role="group" aria-labelledby={id}>
      <span id={id} className={styles.fieldLabel}>
        {label}
      </span>
      {children}
    </div>
  );
};

export const EmptyState = ({ title, text, children }) => (
  <div className={styles.empty}>
    <h3 className={styles.emptyTitle}>{title}</h3>
    {text && <p className={styles.emptyText}>{text}</p>}
    {children}
  </div>
);

export const TableSkeleton = ({ rows = 6, columns = 3, label = "Cargando" }) => (
  <div className={styles.skeleton} role="status" aria-label={label}>
    {Array.from({ length: rows }, (_, row) => (
      <div key={row} className={styles.skeletonRow}>
        {Array.from({ length: columns }, (__, column) => (
          <Skeleton
            key={column}
            variant="rounded"
            height={14}
            width={column === 0 ? "38%" : `${18 - ((row + column) % 3) * 3}%`}
          />
        ))}
      </div>
    ))}
  </div>
);

export const ContentSkeleton = () => (
  <div className={styles.contentSkeleton} role="status" aria-label="Cargando">
    <Skeleton variant="rounded" height={28} width="32%" />
    <Skeleton variant="rounded" height={16} width="52%" />
    <TableSkeleton />
  </div>
);
