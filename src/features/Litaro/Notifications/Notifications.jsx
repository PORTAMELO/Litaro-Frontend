import { useState } from "react";
import { Tab, Tabs, ThemeProvider } from "@mui/material";

import page from "../../../shared/components/Ui/Page.module.css";
import Toast from "../../../shared/components/Ui/Toast";
import { usePermissions } from "../../../shared/hooks/UsePermissions";
import { useToast } from "../../../shared/hooks/UseToast";
import { litaroTheme } from "../../../shared/styles/LitaroTheme";
import InboxTab from "./components/InboxTab";
import RecipientsTab from "./components/RecipientsTab";

const Notifications = () => {
  const { can, ready } = usePermissions();
  const { toast, notify, close } = useToast();
  const [chosenTab, setChosenTab] = useState(null);

  const tabs = [
    { value: "inbox", label: "Bandeja", visible: can("Notification", "read") },
    { value: "recipients", label: "Destinatarios", visible: can("NotificationSettings", "read") },
  ].filter((tab) => tab.visible);

  const activeTab = tabs.some((tab) => tab.value === chosenTab) ? chosenTab : tabs[0]?.value;

  return (
    <ThemeProvider theme={litaroTheme}>
      <div className={page.page}>
        <div className={page.header}>
          <h1 className={page.title}>Notificaciones</h1>
        </div>

        {!ready && <p className={page.message}>Cargando…</p>}

        {ready && tabs.length === 0 && <p className={page.message}>No tienes permisos para ver las notificaciones.</p>}

        {ready && tabs.length > 0 && (
          <>
            <Tabs className={page.tabs} value={activeTab} onChange={(_, value) => setChosenTab(value)}>
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {activeTab === "inbox" && <InboxTab canMarkDone={can("Notification", "update")} notify={notify} />}

            {activeTab === "recipients" && (
              <RecipientsTab canEdit={can("NotificationSettings", "update")} notify={notify} />
            )}
          </>
        )}

        <Toast toast={toast} onClose={close} />
      </div>
    </ThemeProvider>
  );
};

export default Notifications;
