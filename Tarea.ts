export type Tarea = {
  id: string;
  nombre: string;
  fecha: string;
  tarea: string;
  created_at?: string;
};

export type NuevaTarea = {
  nombre: string;
  fecha: string;
  tarea: string;
};