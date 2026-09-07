export const ROLE_FORM_CONFIG = {
  Student: {
    roleLabel: "Estudiante",
    endpoint: "/students",
    fields: [
      { name: "documentType", label: "Tipo de documento", type: "text" },
      { name: "documentNumber", label: "Número de documento", type: "text" },
      { name: "firstName", label: "Nombres", type: "text" },
      { name: "lastName", label: "Apellidos", type: "text" },
      { name: "email", label: "Correo", type: "email" },
      { name: "phoneNumber", label: "Teléfono", type: "tel" },
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        helperText: "Mínimo 8 caracteres, con al menos una mayúscula y un número.",
      },
      { name: "campusId", label: "Sede", type: "foreignKey", foreignKeyTable: "Campus" },
      { name: "studentCode", label: "Código de estudiante", type: "text" },
      { name: "birthDate", label: "Fecha de nacimiento", type: "date" },
      {
        name: "gender",
        label: "Género",
        type: "select",
        options: [
          { value: "M", label: "Masculino" },
          { value: "F", label: "Femenino" },
        ],
      },
    ],
  },

  Parent: {
    roleLabel: "Padre/Acudiente",
    endpoint: "/parents",
    withStudents: true,
    fields: [
      { name: "documentType", label: "Tipo de documento", type: "text" },
      { name: "documentNumber", label: "Número de documento", type: "text" },
      { name: "firstName", label: "Nombres", type: "text" },
      { name: "lastName", label: "Apellidos", type: "text" },
      { name: "email", label: "Correo", type: "email" },
      { name: "phoneNumber", label: "Teléfono", type: "tel" },
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        helperText: "Mínimo 8 caracteres, con al menos una mayúscula y un número.",
      },
      { name: "campusId", label: "Sede", type: "foreignKey", foreignKeyTable: "Campus" },
      { name: "relationship", label: "Parentesco", type: "text" },
    ],
  },

  Teacher: {
    roleLabel: "Profesor",
    endpoint: "/teachers",
    fields: [
      { name: "documentType", label: "Tipo de documento", type: "text" },
      { name: "documentNumber", label: "Número de documento", type: "text" },
      { name: "firstName", label: "Nombres", type: "text" },
      { name: "lastName", label: "Apellidos", type: "text" },
      { name: "email", label: "Correo", type: "email" },
      { name: "phoneNumber", label: "Teléfono", type: "tel" },
      {
        name: "password",
        label: "Contraseña",
        type: "password",
        helperText: "Mínimo 8 caracteres, con al menos una mayúscula y un número.",
      },
      { name: "campusId", label: "Sede", type: "foreignKey", foreignKeyTable: "Campus" },
      { name: "specialty", label: "Especialidad", type: "text" },
    ],
  },
};