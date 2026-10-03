import type { NuevaTarea } from '../types/Tarea';

export function validarTarea(datos: NuevaTarea): string | null {
  if (!datos.nombre.trim()) {
    return 'Escribe el nombre.';
  }

  if (!datos.fecha.trim()) {
    return 'Escribe la fecha.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
    return 'La fecha debe tener el formato AAAA-MM-DD.';
  }

  const fecha = new Date(`${datos.fecha}T00:00:00`);

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.toISOString().slice(0, 10) !== datos.fecha
  ) {
    return 'Escribe una fecha válida.';
  }

  if (!datos.tarea.trim()) {
    return 'Describe qué tarea es.';
  }

  return null;
}