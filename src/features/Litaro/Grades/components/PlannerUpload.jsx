import {
  DeleteButton as SharedDeleteButton,
  UploadButton as SharedUploadButton,
  ViewButton,
} from "../../../../shared/components/Ui/FileButtons";

const PDF_ONLY = "application/pdf,.pdf";

export { ViewButton };

export const UploadButton = (props) => <SharedUploadButton accept={PDF_ONLY} {...props} />;

export const DeleteButton = (props) => (
  <SharedDeleteButton
    title="Eliminar plan de estudio"
    text="La asignatura quedará pendiente de entrega."
    {...props}
  />
);
