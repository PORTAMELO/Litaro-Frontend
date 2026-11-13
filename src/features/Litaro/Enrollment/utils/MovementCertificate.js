const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const longDate = (value) =>
  new Date(value).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });

export const certificateHtml = (certificate) => {
  const text = Object.fromEntries(Object.entries(certificate).map(([key, value]) => [key, escapeHtml(value)]));
  const date = escapeHtml(longDate(certificate.createdAt));
  const note = certificate.note ? `<p><strong>Observación:</strong> ${text.note}</p>` : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Constancia de cambio de sede - ${text.studentName}</title>
<style>
  @page { size: letter; margin: 25mm; }
  body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.6; color: #000; }
  header { text-align: center; margin-bottom: 28pt; }
  header h1 { font-size: 13pt; margin: 0; text-transform: uppercase; }
  header h2 { font-size: 12pt; margin: 18pt 0 0; text-transform: uppercase; letter-spacing: 0.5pt; }
  p { text-align: justify; margin: 0 0 12pt; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 16pt; }
  th, td { border: 1px solid #000; padding: 5pt 8pt; text-align: left; font-size: 11pt; }
  th { width: 22%; }
  .signatures { display: flex; gap: 24pt; margin-top: 70pt; }
  .signature { flex: 1; border-top: 1px solid #000; padding-top: 4pt; text-align: center; font-size: 10.5pt; }
</style>
</head>
<body>
<header>
  <h1>${text.schoolName}</h1>
  <h2>Constancia de cambio de sede</h2>
</header>

<p>
  Se hace constar que el estudiante <strong>${text.studentName}</strong>, identificado con
  ${text.document}, código ${text.studentCode}, matriculado en el grado <strong>${text.gradeName}</strong>
  para el año lectivo ${text.yearId}, fue trasladado de sede dentro de la institución el ${date}.
</p>

<table>
  <tr><th></th><th>Sede</th><th>Código DANE</th><th>Curso</th></tr>
  <tr><th>Origen</th><td>${text.fromCampus}</td><td>${text.fromDane}</td><td>${text.fromClassroom}</td></tr>
  <tr><th>Destino</th><td>${text.toCampus}</td><td>${text.toDane}</td><td>${text.toClassroom}</td></tr>
</table>

<p>
  Las valoraciones, el registro de asistencia y el observador del estudiante continúan en su historial
  académico del año ${text.yearId} sin interrupción.
</p>

${note}

<div class="signatures">
  <div class="signature">Estudiante</div>
  <div class="signature">Padre de familia o acudiente</div>
  <div class="signature">Rector(a)</div>
</div>
</body>
</html>`;
};

export const openCertificateWindow = () => {
  const target = window.open("", "_blank");

  if (target) target.document.write("<p>Generando constancia…</p>");

  return target;
};

export const printCertificate = (target, certificate) => {
  target.document.open();
  target.document.write(certificateHtml(certificate));
  target.document.close();
  target.focus();
  target.print();
};
