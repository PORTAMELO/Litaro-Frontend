import { useCallback, useEffect, useState } from "react";
import * as service from "./services/WebContentManagerService";
import * as configurationService from "./services/WebContentConfigurationService";
import styles from "./Webpage.module.css";
import { ContentSkeleton } from "@/shared/components/Ui/Ui";

import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Stack } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import ContentTable from "./components/ContentTable";
import ContentEditor from "./components/ContentEditor";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import Toast from "@/shared/components/Ui/Toast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useToast } from "@/shared/hooks/useToast";

const pageOrder = ["Home", "Nosotros", "Calendario", "Admisiones", "Footer"];

// Nombre que ve el usuario cuando difiere del nombre técnico de la página.
const pageLabels = { Footer: "Información institucional" };

const Webpage = () => {
  const [contents, setContents] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { toast, notify, close: closeToast } = useToast();
  const { ask, dialogProps } = useConfirm();

  const load = useCallback(async () => {
    try {
      const [contentData, configurationData] = await Promise.all([service.getAll(), configurationService.getAll()]);

      setContents(contentData);
      setConfigurations(configurationData);
    } catch (err) {
      console.error(err);
      notify("No fue posible cargar el contenido.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const handleCreate = (configuration) => {
    const items = contents.filter(
      (x) =>
        x.pageName === configuration.pageName &&
        x.sectionName === configuration.sectionName &&
        x.contentKey === configuration.contentKey,
    );

    const maxOrder = items.length === 0 ? 0 : Math.max(...items.map((i) => i.displayOrder));

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

        notify("Contenido actualizado correctamente.", "success");
      } else {
        await service.create(payload);

        notify("Contenido creado correctamente.", "success");
      }

      setEditorOpen(false);
      setSelectedContent(null);

      await load();
    } catch (err) {
      notify(err.message, "error", { title: "No fue posible guardar" });
    }
  };

  const deleteContent = async (content) => {
    try {
      await service.remove(content.webContentId);

      notify("Contenido eliminado correctamente.", "success");

      await load();
    } catch (err) {
      notify(err.message, "error", { title: "No fue posible eliminar" });
    }
  };

  const handleDelete = (content) => {
    ask({
      title: "Eliminar contenido",
      message: "¿Está seguro de eliminar este contenido?",
      action: () => deleteContent(content),
    });
  };

  const handleActivate = async (content) => {
    try {
      await service.activate(content.webContentId);

      notify("Contenido activado correctamente.", "success");

      await load();
    } catch (err) {
      notify(err.message, "error", { title: "No fue posible activar" });
    }
  };

  const deactivateContent = async (content) => {
    try {
      await service.deactivate(content.webContentId);

      notify("Contenido desactivado.", "success");

      await load();
    } catch (err) {
      notify(err.message, "error", { title: "No fue posible desactivar" });
    }
  };

  const handleDeactivate = (content) => {
    ask({
      title: "Desactivar contenido",
      message: "¿Desea desactivar este contenido?",
      action: () => deactivateContent(content),
    });
  };

  const grouped = configurations.reduce((acc, configuration) => {
    if (!acc[configuration.pageName]) {
      acc[configuration.pageName] = {};
    }

    if (!acc[configuration.pageName][configuration.sectionName]) {
      acc[configuration.pageName][configuration.sectionName] = {
        configuration,
        items: [],
      };
    }

    acc[configuration.pageName][configuration.sectionName].items = contents.filter(
      (x) =>
        x.pageName === configuration.pageName &&
        x.sectionName === configuration.sectionName,
    );

    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Administrador de contenido</h1>

      {loading && <ContentSkeleton />}

      {!loading && pageOrder
        .filter((page) => grouped[page])
        .map((page) => {
          const sections = grouped[page];

          return (
            <Accordion key={page} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{pageLabels[page] ?? page}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {Object.entries(sections).map(([section, data]) => (
                  <Accordion key={section} className={styles["section-accordion"]}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles["section-accordion-summary"]}>
                      <Typography className={styles["section-title"]}>{section}</Typography>
                    </AccordionSummary>

                    <AccordionDetails className={styles["section-accordion-details"]}>
                      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
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

      <Toast toast={toast} onClose={closeToast} />

      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default Webpage;
