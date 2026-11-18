import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import Toast from "@/shared/components/Ui/Toast";
import { useLoad } from "@/shared/hooks/useLoad";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useToast } from "@/shared/hooks/useToast";
import CitationsTab from "./components/CitationsTab";
import ConsolidatedTab from "./components/ConsolidatedTab";
import RecordTab from "./components/RecordTab";
import * as service from "./services/ObservationService";

const TABS = [
  { value: "record", label: "Registro", keys: ["ObservationRecord", "ObservationConsolidated"], Component: RecordTab },
  { value: "citations", label: "Citaciones", keys: ["Citation"], Component: CitationsTab },
  { value: "consolidated", label: "Consolidado", keys: ["ObservationConsolidated"], Component: ConsolidatedTab },
];

const Observations = () => {
  const { can, ready } = usePermissions();
  const { toast, notify, close } = useToast();
  const [chosenTab, setChosenTab] = useState(null);

  const tabs = TABS.filter((tab) => tab.keys.some((key) => can(key, "read")));
  const active = tabs.find((tab) => tab.value === chosenTab) ?? tabs[0];

  const { data: options, error } = useLoad(() => service.getOptions(), [], ready && tabs.length > 0);

  return (
    <div className={page.page}>
      <div className={page.header}>
        <h1 className={page.title}>Observaciones y citaciones</h1>
      </div>

      {!ready && <p className={page.message}>Cargando…</p>}

      {ready && tabs.length === 0 && <p className={page.message}>No tienes permisos para ver el Observador.</p>}

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
  );
};

export default Observations;
