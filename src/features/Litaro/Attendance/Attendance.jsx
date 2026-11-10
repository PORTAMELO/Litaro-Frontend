import { useState } from "react";
import { Tab, Tabs, ThemeProvider } from "@mui/material";

import page from "../../../shared/components/Ui/Page.module.css";
import Toast from "../../../shared/components/Ui/Toast";
import { useLoad } from "../../../shared/hooks/UseLoad";
import { usePermissions } from "../../../shared/hooks/UsePermissions";
import { useToast } from "../../../shared/hooks/UseToast";
import { litaroTheme } from "../../../shared/styles/LitaroTheme";
import ExcusesTab from "./components/ExcusesTab";
import LateArrivalsTab from "./components/LateArrivalsTab";
import RollTab from "./components/RollTab";
import SettingsTab from "./components/SettingsTab";
import SummaryTab from "./components/SummaryTab";
import * as service from "./services/AttendanceService";

const TABS = [
  { value: "roll", label: "Tomar lista", key: "AttendanceRoll", Component: RollTab },
  { value: "summary", label: "Resumen", key: "AttendanceSummary", Component: SummaryTab },
  { value: "excuses", label: "Excusas", key: "AttendanceExcuse", Component: ExcusesTab },
  { value: "late", label: "Llegadas tarde", key: "LateArrival", Component: LateArrivalsTab },
  { value: "settings", label: "Parámetros", key: "AttendanceSettings", Component: SettingsTab },
];

const Attendance = () => {
  const { can, ready } = usePermissions();
  const { toast, notify, close } = useToast();
  const [chosenTab, setChosenTab] = useState(null);

  const tabs = TABS.filter((tab) => can(tab.key, "read"));
  const active = tabs.find((tab) => tab.value === chosenTab) ?? tabs[0];

  const { data: options, error } = useLoad(() => service.getOptions(), [], ready && tabs.length > 0);

  return (
    <ThemeProvider theme={litaroTheme}>
      <div className={page.page}>
        <div className={page.header}>
          <h1 className={page.title}>Asistencia</h1>
        </div>

        {!ready && <p className={page.message}>Cargando…</p>}

        {ready && tabs.length === 0 && <p className={page.message}>No tienes permisos para ver la asistencia.</p>}

        {ready && tabs.length > 0 && (
          <>
            <Tabs
              className={page.tabs}
              value={active.value}
              onChange={(_, value) => setChosenTab(value)}
              variant="scrollable"
              scrollButtons={false}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {error && <p className={page.message}>{error}</p>}

            {!error && !options && <p className={page.message}>Cargando…</p>}

            {options && <active.Component options={options} can={can} notify={notify} />}
          </>
        )}

        <Toast toast={toast} onClose={close} />
      </div>
    </ThemeProvider>
  );
};

export default Attendance;
