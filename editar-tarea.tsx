
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { tareaRepository } from '../repositories/tareaRepository';
import { validarTarea } from '../validators/tareaValidator';

export default function EditarTareaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [tarea, setTarea] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarTarea() {
      if (!id) {
        Alert.alert('Error', 'No se recibió el ID de la tarea.');
        router.back();
        return;
      }

      try {
        setCargando(true);

        const tareas = await tareaRepository.obtenerTodas();
        const datos = tareas.find(
          (item) => String(item.id) === String(id)
        );

        if (!activo) return;

        if (!datos) {
          Alert.alert('Error', 'No se encontró la tarea.');
          router.back();
          return;
        }

        setNombre(datos.nombre ?? '');
        setFecha(datos.fecha ?? '');
        setTarea(datos.tarea ?? '');
      } catch (error) {
        if (!activo) return;

        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la tarea.'
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarTarea();

    return () => {
      activo = false;
    };
  }, [id]);

  async function actualizarTarea() {
    if (!id) {
      Alert.alert('Error', 'No se encontró el ID de la tarea.');
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      fecha: fecha.trim(),
      tarea: tarea.trim(),
    };

    const errorValidacion = validarTarea(datos);

    if (errorValidacion) {
      Alert.alert('Datos incorrectos', errorValidacion);
      return;
    }

    try {
      setGuardando(true);

      await tareaRepository.actualizar(String(id), datos);

      Alert.alert(
        'Éxito',
        'La tarea se actualizó correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error al actualizar',
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la tarea.'
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.cargando}>Cargando tarea...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Editar tarea</Text>

        <Text style={styles.subtitulo}>
          Modifica la información de la tarea.
        </Text>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la tarea"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.etiqueta}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          value={fecha}
          onChangeText={setFecha}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>Responsable</Text>
        <TextInput
          style={[styles.input, styles.area]}
          placeholder="Escribe el nombre del/los autores de esta tarea"
          value={tarea}
          onChangeText={setTarea}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.boton,
            guardando && styles.botonDesactivado,
          ]}
          onPress={actualizarTarea}
          disabled={guardando}
        >
          <Text style={styles.textoBoton}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => router.back()}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  contenido: {
    padding: 20,
    paddingTop: 35,
    paddingBottom: 30,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  subtitulo: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 25,
  },

  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: '#0f172a',
  },

  area: {
    minHeight: 110,
  },

  boton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  botonDesactivado: {
    opacity: 0.6,
  },

  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botonCancelar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  textoCancelar: {
    color: '#475569',
    fontSize: 16,
  },

  cargandoContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cargando: {
    marginTop: 12,
    fontSize: 18,
    color: '#64748b',
  },
});
