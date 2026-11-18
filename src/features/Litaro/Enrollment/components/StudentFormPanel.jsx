import { useState } from "react";

import styles from "../Enrollment.module.css";
import * as service from "../services/EnrollmentService";
import SidePanel from "@/shared/components/Ui/SidePanel";
import { ContentSkeleton } from "@/shared/components/Ui/Ui";
import { useLoad } from "@/shared/hooks/useLoad";
import FormPanel from "./FormPanel";
import { fromDetail, toRequest } from "../utils/EnrollmentForm";

const StudentFormPanel = ({ studentId, yearId, options, canManage, onClose, onChanged, notify }) => {
  const [override, setOverride] = useState(null);
  const [docsChanged, setDocsChanged] = useState(false);

  const { data, error } = useLoad(() => service.getStudentForm(studentId, yearId), [studentId, yearId]);
  const detail = data?.studentId === studentId ? data : null;

  const close = () => {
    if (docsChanged) onChanged();
    onClose();
  };

  if (!detail) {
    return (
      <SidePanel open title="Estudiante" onClose={close}>
        {error ? <p className={styles.message}>{error}</p> : <ContentSkeleton />}
      </SidePanel>
    );
  }

  const save = async (form) => {
    const request = toRequest(form, yearId);
    await service.saveStudentForm(studentId, { student: request.student, guardian: request.guardian, c600: request.c600 });
    notify("Datos actualizados.");
    onChanged();
    onClose();
  };

  return (
    <FormPanel
      title={`${detail.student.firstName} ${detail.student.lastName}`}
      subtitle={`Código ${detail.studentCode}`}
      options={options}
      initialForm={fromDetail({ ...detail, gradeId: "" })}
      withGrade={false}
      lockIdentity
      guardianOptional
      readOnly={!canManage}
      checklist={override ?? detail.documents}
      documents={{
        upload: (detailId, file) => service.uploadStudentDocument(studentId, yearId, detailId, file),
        remove: (detailId) => service.deleteStudentDocument(studentId, yearId, detailId),
        open: (detailId) => service.downloadStudentDocument(studentId, yearId, detailId),
      }}
      canManageDocuments={canManage}
      submitLabel="Guardar"
      onSubmit={save}
      onChecklistChange={(value) => {
        setOverride(value);
        setDocsChanged(true);
      }}
      onClose={close}
      notify={notify}
    />
  );
};

export default StudentFormPanel;
