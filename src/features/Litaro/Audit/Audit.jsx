import { useState } from "react";
import { Tab, Tabs } from "@mui/material";

import page from "@/shared/components/Ui/Page.module.css";
import Toast from "@/shared/components/Ui/Toast";
import { useLoad } from "@/shared/hooks/useLoad";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useToast } from "@/shared/hooks/useToast";
import AuditDetailPanel from "./components/AuditDetailPanel";
import AuditTab from "./components/AuditTab";
import * as service from "./services/AuditService";
import { defaultFilters, initialTabState, TABS } from "./utils/AuditUtils";

const Audit = () => {
  const { can, ready } = usePermissions();
  const { toast, notify, close } = useToast();
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [tabStates, setTabStates] = useState(() =>
    Object.fromEntries(TABS.map((tab) => [tab.value, initialTabState()])),
  );
  const [openId, setOpenId] = useState(null);

  const allowed = ready && can("AuditModule", "read");

  const { data: options, error } = useLoad(() => service.getOptions(), [], allowed);

  const setTabState = (category, state) => setTabStates((current) => ({ ...current, [category]: state }));

  const showHistory = (tableName, recordId) => {
    setOpenId(null);
    setActiveTab("data");
    setTabState("data", { filters: { ...defaultFilters(), tableName, recordId: String(recordId) }, page: 1 });
  };

  return (
    <>
      <div className={page.page}>
        <div className={page.header}>
          <h1 className={page.title}>Auditoría</h1>
        </div>

        {!ready && <p className={page.message}>Cargando…</p>}

        {ready && !allowed && <p className={page.message}>No tienes permisos para ver la auditoría.</p>}

        {allowed && (
          <>
            <Tabs
              className={page.tabs}
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons={false}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {error && <p className={page.message}>{error}</p>}

            {!error && !options && <p className={page.message}>Cargando…</p>}

            {options && (
              <AuditTab
                key={activeTab}
                category={activeTab}
                options={options}
                notify={notify}
                onOpen={setOpenId}
                selectedId={openId}
                state={tabStates[activeTab]}
                onState={(state) => setTabState(activeTab, state)}
              />
            )}
          </>
        )}

        <AuditDetailPanel
          id={openId}
          notify={notify}
          onClose={() => setOpenId(null)}
          onOpen={setOpenId}
          onShowHistory={showHistory}
        />

        <Toast toast={toast} onClose={close} />
      </div>
    </>
  );
};

export default Audit;
