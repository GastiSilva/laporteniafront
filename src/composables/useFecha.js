/**
 * Helpers de fecha con semantica de "fecha calendario" (sin hora).
 *
 * El problema que resuelven: `new Date('2025-05-28')` se interpreta como UTC
 * medianoche, y al mostrarla con toLocaleDateString en Argentina (UTC-3) cae al
 * 27/05. Lo mismo al reves con `toISOString()` para obtener "hoy": despues de
 * las 21hs local ya devuelve la fecha del dia siguiente.
 *
 * Como los remitos y movimientos manejan fechas de negocio (no instantes), lo
 * correcto es tratar siempre la porcion YYYY-MM-DD como fecha local.
 */

/** Formatea 'YYYY-MM-DD' o un ISO completo como dd/mm/aaaa local. */
export function formatearFecha(valor) {
  if (!valor) return '';

  const [parteFecha] = String(valor).split('T');
  const [anio, mes, dia] = parteFecha.split('-').map(Number);

  if (anio && mes && dia) {
    return new Date(anio, mes - 1, dia).toLocaleDateString('es-AR');
  }

  const fallback = new Date(valor);
  return Number.isNaN(fallback.getTime()) ? '' : fallback.toLocaleDateString('es-AR');
}

/** Fecha de hoy como 'YYYY-MM-DD' en horario local (no UTC). */
export function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}
