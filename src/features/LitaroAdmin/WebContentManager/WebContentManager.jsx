import { useEffect, useState } from "react";
import * as service from "../services/WebContentManagerService";
import * as configurationService from "../services/WebContentConfigurationService";
import styles from "./styles/WebContentManager.module.css";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import ContentTable from "./components/ContentTable";
import ContentEditor from "./components/ContentEditor";
import AppNotification from "./components/AppNotification";
import ConfirmDialog from "./components/ConfirmDialog";

const pageOrder = ["Home", "Nosotros", "Calendario", "Admisiones"];

const WebContentManager = () => {
  const [contents, setContents] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    title: "",
    message: "",
  });

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  const load = async () => {
    try {
      const [contentData, configurationData] = await Promise.all([
        service.getAll(),
        configurationService.getAll(),
      ]);

      setContents(contentData);
      setConfigurations(configurationData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const showNotification = ({
    severity = "success",
    title = "",
    message = "",
  }) => {
    setNotification({
      open: true,
      severity,
      title,
      message,
    });
  };

  const askConfirmation = ({ title, message, action }) => {
    setConfirm({
      open: true,
      title,
      message,
      action,
    });
  };

  const handleCreate = (configuration) => {
    const items = contents.filter(
      (x) =>
        x.pageName === configuration.pageName &&
        x.sectionName === configuration.sectionName &&
        x.contentKey === configuration.contentKey,
    );

    const maxOrder =
      items.length === 0 ? 0 : Math.max(...items.map((i) => i.displayOrder));

    const newContent = {
      pageName: configuration.pageName,
      sectionName: configuration.sectionName,
      contentKey: configuration.contentKey,
      displayOrder: maxOrder + 1,
      active: true,
      dataJson: configuration.templateJson,
    };

    setSelectedContent(newContent);

    setEditorOpen(true);
  };

  const handleEdit = (content) => {
    setSelectedContent(content);

    setEditorOpen(true);
  };

  const handleSave = async (form) => {
    try {
      const payload = {
        ...selectedContent,
        dataJson: JSON.stringify(form),
      };

      if (selectedContent.webContentId) {
        await service.update(selectedContent.webContentId, payload);

        showNotification({
          severity: "success",
          message: "Contenido actualizado correctamente.",
        });
      } else {
        await service.create(payload);

        showNotification({
          severity: "success",
          message: "Contenido creado correctamente.",
        });
      }

      setEditorOpen(false);
      setSelectedContent(null);

      await load();
    } catch (err) {
      showNotification({
        severity: "error",
        title: "Error",
        message: err.message,
      });
    }
  };

  const deleteContent = async (content) => {
    try {
      await service.remove(content.webContentId);

      showNotification({
        severity: "success",
        message: "Contenido eliminado correctamente.",
      });

      await load();
    } catch (err) {
      showNotification({
        severity: "error",
        title: "No fue posible eliminar",
        message: err.message,
      });
    }
  };

  const handleDelete = (content) => {
    askConfirmation({
      title: "Eliminar contenido",
      message: "¿Está seguro de eliminar este contenido?",
      action: () => deleteContent(content),
    });
  };

  const handleActivate = async (content) => {
    try {
      await service.activate(content.webContentId);

      showNotification({
        severity: "success",
        message: "Contenido activado correctamente.",
      });

      await load();
    } catch (err) {
      showNotification({
        severity: "error",
        title: "No fue posible activar",
        message: err.message,
      });
    }
  };

  const deactivateContent = async (content) => {
    try {
      await service.deactivate(content.webContentId);

      showNotification({
        severity: "success",
        message: "Contenido desactivado.",
      });

      await load();
    } catch (err) {
      showNotification({
        severity: "error",
        title: "No fue posible desactivar",
        message: err.message,
      });
    }
  };

  const handleDeactivate = (content) => {
    askConfirmation({
      title: "Desactivar contenido",
      message: "¿Desea desactivar este contenido?",
      action: () => deactivateContent(content),
    });
  };

  const grouped = configurations.reduce((acc, configuration) => {
    if (!acc[configuration.pageName]) {
      acc[configuration.pageName] = {};
    }

    acc[configuration.pageName][configuration.sectionName] = {
      configuration,

      items: contents.filter(
        (x) =>
          x.pageName === configuration.pageName &&
          x.sectionName === configuration.sectionName &&
          x.contentKey === configuration.contentKey,
      ),
    };

    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Administrador de contenido</h1>

      {pageOrder
        .filter((page) => grouped[page])
        .map((page) => {
          const sections = grouped[page];

          return (
            <Accordion key={page} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{page}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {Object.entries(sections).map(([section, data]) => (
                  <Accordion
                    key={section}
                    className={styles["section-accordion"]}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      className={styles["section-accordion-summary"]}
                    >
                      <Typography className={styles["section-title"]}>
                        {section}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                      className={styles["section-accordion-details"]}
                    >
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        sx={{ mb: 1.5 }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleCreate(data.configuration)}
                          className={styles["new-button"]}
                        >
                          Nuevo
                        </Button>
                      </Stack>

                      <ContentTable
                        rows={data.items}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}

      <ContentEditor
        open={editorOpen}
        content={selectedContent}
        onClose={() => {
          setEditorOpen(false);
          setSelectedContent(null);
        }}
        onSave={handleSave}
      />

      <AppNotification
        {...notification}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onClose={() =>
          setConfirm((prev) => ({
            ...prev,
            open: false,
          }))
        }
        onConfirm={async () => {
          await confirm.action?.();

          setConfirm((prev) => ({
            ...prev,
            open: false,
          }));
        }}
      />
    </div>
  );
};

export default WebContentManager;