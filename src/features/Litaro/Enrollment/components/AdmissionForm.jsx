import { useState } from "react";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { ContentSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import FormPanel from "./FormPanel";
import { EMPTY_FORM, fromDetail, toRequest, withDefaults } from "../utils/EnrollmentForm";

const AdmissionForm = ({ yearId, options, admissionId = null, canManageDocuments, onClose, onChanged, onSaved, notify }) => {
  const [id, setId] = useState(admissionId);
  const [created, setCreated] = useState(false);
  const [override, setOverride] = useState(null);
  const [docsChanged, setDocsChanged] = useState(false);

  const { data, error } = useLoad(() => service.getAdmission(id), [id], id !== null);
  const detail = data?.summary?.admissionRequestId === id ? data : null;

  const close = () => {
    if (docsChanged) onChanged();
    onClose();
  };

  if (id !== null && !detail) {
    return (
      <SidePanel open title="Solicitud" onClose={close}>
        {error ? <p className={styles.message}>{error}</p> : <ContentSkeleton />}
      </SidePanel>
    );
  }

  const checklist = override?.id === id ? override.value : (detail?.documents ?? null);

  const create = async (form) => {
    const result = await service.createAdmission(toRequest(form, yearId));
    notify("Solicitud registrada.");
    onChanged();
    setCreated(true);
    setId(result.admissionRequestId);
  };

  const update = async (form) => {
    await service.updateAdmission(id, toRequest(form, yearId));
    notify("Solicitud actualizada.");
    onChanged();
    (onSaved ?? onClose)();
  };

  const documents =
    id === null
      ? null
      : {
          upload: (detailId, file) => service.uploadAdmissionDocument(id, detailId, file),
          remove: (detailId) => service.deleteAdmissionDocument(id, detailId),
          open: (detailId) => service.downloadAdmissionDocument(id, detailId),
        };

  return (
    <FormPanel
      key={id ?? "new"}
      title={detail ? `${detail.summary.firstName} ${detail.summary.lastName}` : "Nueva solicitud"}
      subtitle={detail ? "Solicitud de admisión" : `Admisión para ${yearId}`}
      options={options}
      initialForm={detail ? fromDetail(detail) : withDefaults(EMPTY_FORM, options?.catalogs)}
      initialTab={created ? "documents" : "student"}
      withNotes
      checklist={checklist}
      documents={documents}
      canManageDocuments={canManageDocuments}
      submitLabel={detail ? "Guardar" : "Registrar solicitud"}
      onSubmit={detail ? update : create}
      onChecklistChange={(value) => {
        setOverride({ id, value });
        setDocsChanged(true);
      }}
      onClose={close}
      notify={notify}
    />
  );
};

export default AdmissionForm;
