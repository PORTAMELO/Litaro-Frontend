import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlaceIcon from "@mui/icons-material/Place";

import styles from "../Schedule.module.css";
import { WEEKDAYS, blockTitle, shortTime, sortBlocks, typeInfo } from "../utils/ScheduleUtils";

const WeekView = ({ blocks, showSaturday, subtitleOf, onAdd, onEdit }) => {
  const days = WEEKDAYS.filter((day) => day.value <= 5 || showSaturday || blocks.some((b) => b.weekday === 6));
  const sorted = sortBlocks(blocks);

  return (
    <div className={styles.week} style={{ gridTemplateColumns: `repeat(${days.length}, minmax(125px, 1fr))` }}>
      {days.map((day) => {
        const dayBlocks = sorted.filter((block) => block.weekday === day.value);

        return (
          <div key={day.value} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              <span>{day.label}</span>
              {onAdd && (
                <Tooltip title={`Agregar el ${day.label.toLowerCase()}`}>
                  <IconButton size="small" onClick={() => onAdd(day.value)} aria-label={`Agregar el ${day.label}`}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>

            <div className={styles.dayBody}>
              {dayBlocks.length === 0 && <p className={styles.dayEmpty}>Libre</p>}

              {dayBlocks.map((block) => {
                const info = typeInfo(block.type);
                const subtitle = subtitleOf?.(block);
                const content = (
                  <>
                    <span className={styles.blockTime}>
                      {shortTime(block.startTime)} – {shortTime(block.endTime)}
                    </span>
                    <span className={styles.blockTitle}>{blockTitle(block)}</span>
                    {subtitle && <span className={styles.blockSubtitle}>{subtitle}</span>}
                    {block.type !== "CLASS" && <span className={styles.blockType}>{info.label}</span>}
                    {block.spaceName && (
                      <span className={styles.blockSpace}>
                        <PlaceIcon sx={{ fontSize: 12 }} /> {block.spaceName}
                      </span>
                    )}
                  </>
                );
                const blockStyle = { borderLeftColor: info.color, backgroundColor: info.background };

                return onEdit ? (
                  <button
                    type="button"
                    key={block.scheduleId}
                    className={`${styles.block} ${styles.blockClickable}`}
                    style={blockStyle}
                    onClick={() => onEdit(block)}
                    title="Cambiar o quitar"
                  >
                    {content}
                  </button>
                ) : (
                  <div key={block.scheduleId} className={styles.block} style={blockStyle}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
