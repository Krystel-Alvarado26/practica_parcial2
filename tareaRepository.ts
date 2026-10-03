
import { supabase } from '../services/supabase';
import type { NuevaTarea, Tarea } from '../types/Tarea';

export const tareaRepository = {
  async obtenerTodas(): Promise<Tarea[]> {
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  },

  async crear(datos: NuevaTarea): Promise<Tarea> {
    const { data, error } = await supabase
      .from('tareas')
      .insert([datos])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async actualizar(
    id: string,
    datos: NuevaTarea
  ): Promise<Tarea> {
    const { data, error } = await supabase
      .from('tareas')
      .update(datos)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.log('Error al actualizar:', error.message);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(
        'No se encontró la tarea para actualizar. Verifica su ID.'
      );
    }

    return data;
  },
};
