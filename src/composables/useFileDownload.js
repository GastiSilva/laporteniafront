/**
 * Dispara la descarga de un blob en el navegador.
 *
 * Centraliza el patron createObjectURL + <a> + click que antes estaba repetido
 * en cada servicio y vista que descargaba un PDF o un Excel. A diferencia de
 * esas copias, este helper libera la object URL con revokeObjectURL: sin eso
 * cada descarga dejaba el blob retenido en memoria hasta recargar la pagina.
 *
 * @param {Blob|ArrayBuffer} data - cuerpo de la respuesta (axios con responseType: 'blob')
 * @param {string} filename - nombre con el que se guarda el archivo
 * @param {string} [mimeType] - tipo MIME; si se omite se respeta el del blob original
 */
export function downloadBlob(data, filename, mimeType) {
  const blob = mimeType ? new Blob([data], { type: mimeType }) : new Blob([data]);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export const MIME_PDF = 'application/pdf';
export const MIME_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
