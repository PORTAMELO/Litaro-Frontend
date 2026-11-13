import { useState } from "react";

import * as service from "../services/GradingService";
import { openBlob } from "../utils/GradingUtils";

export const usePlannerFiles = ({ notify, onChanged }) => {
  const [busy, setBusy] = useState(null);

  const upload = async (assignmentId, file) => {
    if (!file) return;

    setBusy(assignmentId);

    try {
      await service.uploadPlanner(assignmentId, file);
      notify("Plan de estudio cargado.");
      onChanged();
    } catch (failure) {
      notify(failure.message ?? "No fue posible cargar el plan de estudio.", "error");
    } finally {
      setBusy(null);
    }
  };

  const open = async (assignmentId) => {
    setBusy(assignmentId);

    try {
      openBlob(await service.downloadPlanner(assignmentId));
    } catch (failure) {
      notify(failure.message ?? "No fue posible abrir el plan de estudio.", "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (assignmentId) => {
    setBusy(assignmentId);

    try {
      await service.deletePlanner(assignmentId);
      notify("Plan de estudio eliminado.");
      onChanged();
    } catch (failure) {
      notify(failure.message ?? "No fue posible eliminar el plan de estudio.", "error");
    } finally {
      setBusy(null);
    }
  };

  return { busy, upload, open, remove };
};
