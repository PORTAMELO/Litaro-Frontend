import { useState } from "react";

import styles from "./Observations.module.css";
import { initialAppointments, initialFilters, initialObservations, initialStudents, mockFilters } from "./ObservationsData";
import AppointmentDialog from "./components/AppointmentDialog";
import AppointmentsTable from "./components/AppointmentsTable";
import GroupFilters from "./components/GroupFilters";
import ObservationDialog from "./components/ObservationDialog";
import ObservationsTable from "./components/ObservationsTable";
import StudentsTable from "./components/StudentsTable";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import Toast from "@/shared/components/Ui/Toast";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { useToast } from "@/shared/hooks/useToast";

const Observations = () => {
  const [filters, setFilters] = useState(initialFilters);

  const [students] = useState(initialStudents);

  const [observations, setObservations] = useState(initialObservations);
  const [appointments, setAppointments] = useState(initialAppointments);

  const { toast, notify, close: closeToast } = useToast();
  const { ask, dialogProps } = useConfirm();

  const [observationDialog, setObservationDialog] = useState({
    open: false,
    student: null,
    observation: null,
  });

  const [appointmentDialog, setAppointmentDialog] = useState({
    open: false,
    student: null,
    appointment: null,
  });

  const selectedClassroom = mockFilters.classrooms.find((classroom) => classroom.id === filters.classroom);

  const filteredStudents = students.filter((student) => student.classroom === filters.classroom);

  const getStudent = (studentId) => students.find((student) => student.id === studentId);

  const inGroup = (record) => filteredStudents.some((student) => student.id === record.studentId);
  const groupObservations = observations.filter(inGroup);
  const groupAppointments = appointments.filter(inGroup);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGradeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      grade: value,
      classroom: mockFilters.classrooms.find((classroom) => classroom.grade === value)?.id ?? "",
    }));
  };

  const openObservation = (student, observation = null) => {
    setObservationDialog({
      open: true,
      student,
      observation,
    });
  };

  const openAppointment = (student, appointment = null) => {
    setAppointmentDialog({
      open: true,
      student,
      appointment,
    });
  };

  const closeObservation = () => {
    setObservationDialog({
      open: false,
      student: null,
      observation: null,
    });
  };

  const closeAppointment = () => {
    setAppointmentDialog({
      open: false,
      student: null,
      appointment: null,
    });
  };

  const handleObservationSave = (form) => {
    if (observationDialog.observation) {
      setObservations((prev) =>
        prev.map((item) =>
          item.id === observationDialog.observation.id
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );

      notify("Observación actualizada correctamente.", "success");
    } else {
      setObservations((prev) => [
        ...prev,
        {
          id: Date.now(),
          studentId: observationDialog.student.id,
          ...form,
        },
      ]);

      notify("Observación registrada correctamente.", "success");
    }

    closeObservation();
  };

  const handleAppointmentSave = (form) => {
    if (appointmentDialog.appointment) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentDialog.appointment.id
            ? {
                ...item,
                ...form,
              }
            : item,
        ),
      );

      notify("Citación actualizada correctamente.", "success");
    } else {
      setAppointments((prev) => [
        ...prev,
        {
          id: Date.now(),
          studentId: appointmentDialog.student.id,
          ...form,
        },
      ]);

      notify("Citación registrada correctamente.", "success");
    }

    closeAppointment();
  };

  const handleDeleteObservation = (observation) => {
    ask({
      title: "Eliminar observación",
      message: "¿Está seguro de eliminar esta observación?",
      action: () => {
        setObservations((prev) => prev.filter((item) => item.id !== observation.id));

        notify("Observación eliminada correctamente.", "success");
      },
    });
  };

  const handleDeleteAppointment = (appointment) => {
    ask({
      title: "Eliminar citación",
      message: "¿Está seguro de eliminar esta citación?",
      action: () => {
        setAppointments((prev) => prev.filter((item) => item.id !== appointment.id));

        notify("Citación eliminada correctamente.", "success");
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Observaciones y citaciones</h1>

          <p className={styles.subtitle}>Registra observaciones y gestiona las citaciones de los estudiantes.</p>
        </div>
      </div>

      <GroupFilters filters={filters} onFilterChange={handleFilterChange} onGradeChange={handleGradeChange} />

      <StudentsTable
        classroomName={selectedClassroom?.name}
        students={filteredStudents}
        onObservation={openObservation}
        onAppointment={openAppointment}
      />

      <ObservationsTable
        observations={groupObservations}
        studentOf={getStudent}
        onEdit={openObservation}
        onDelete={handleDeleteObservation}
      />

      <AppointmentsTable
        appointments={groupAppointments}
        studentOf={getStudent}
        onEdit={openAppointment}
        onDelete={handleDeleteAppointment}
      />

      <ObservationDialog
        open={observationDialog.open}
        student={observationDialog.student}
        observation={observationDialog.observation}
        onClose={closeObservation}
        onSave={handleObservationSave}
      />

      <AppointmentDialog
        open={appointmentDialog.open}
        student={appointmentDialog.student}
        appointment={appointmentDialog.appointment}
        onClose={closeAppointment}
        onSave={handleAppointmentSave}
      />

      <Toast toast={toast} onClose={closeToast} />

      <ConfirmDialog {...dialogProps} />
    </div>
  );
};

export default Observations;
