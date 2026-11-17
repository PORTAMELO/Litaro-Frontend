import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import Toast from "@/shared/components/Ui/Toast";
import { useLoad } from "@/shared/hooks/useLoad";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useToast } from "@/shared/hooks/useToast";
import DeadlinesTab from "./components/DeadlinesTab";
import GradeSheetTab from "./components/GradeSheetTab";
import PlannerPanelTab from "./components/PlannerPanelTab";
import PlannersTab from "./components/PlannersTab";
import YearClosingTab from "./components/YearClosingTab";
import * as service from "./services/GradingService";

const TABS = [
  { value: "sheet", label: "Planilla", key: "GradeBook", actions: ["read", "update"], Component: GradeSheetTab },
  { value: "planners", label: "Plan de estudio", key: "StudyPlanner", actions: ["create"], Component: PlannersTab },
  { value: "panel", label: "Seguimiento", key: "StudyPlannerPanel", actions: ["read"], Component: PlannerPanelTab },
  { value: "settings", label: "Parámetros", key: "GradeSettings", actions: ["read"], Component: DeadlinesTab },
  { value: "closing", label: "Cierre de año", key: "YearClosing", actions: ["read"], Component: YearClosingTab, standalone: true },
];

const Grades = () => {
  const { can, ready } = usePermissions();
  const { toast, notify, close } = useToast();
  const [chosenTab, setChosenTab] = useState(null);

  const tabs = TABS.filter((tab) => tab.actions.some((action) => can(tab.key, action)));
  const active = tabs.find((tab) => tab.value === chosenTab) ?? tabs[0];

  const needsOptions = tabs.some((tab) => !tab.standalone);
  const { data: options, error } = useLoad(() => service.getOptions(), [], ready && needsOptions);

  return (
    <>
      <div className={page.page}>
        <div className={page.header}>
          <h1 className={page.title}>Notas</h1>
        </div>

        {!ready && <p className={page.message}>Cargando…</p>}

        {ready && tabs.length === 0 && <p className={page.message}>No tienes permisos para ver las notas.</p>}

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

            {active.standalone && <active.Component can={can} notify={notify} />}

            {!active.standalone && error && <p className={page.message}>{error}</p>}

            {!active.standalone && !error && !options && <p className={page.message}>Cargando…</p>}

            {!active.standalone && options && <active.Component options={options} can={can} notify={notify} />}
          </>
        )}

        <Toast toast={toast} onClose={close} />
      </div>
    </>
  );
};

export default Grades;
