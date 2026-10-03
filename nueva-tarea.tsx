import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { tareaRepository } from '../repositories/tareaRepository';
import { validarTarea } from '../validators/tareaValidator';

export default function NuevaTareaScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [tarea, setTarea] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardarTarea() {
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

      await tareaRepository.crear(datos);

      Alert.alert(
        'Éxito',
        'La tarea se guardó correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la tarea.'
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>
          Nueva tarea
        </Text>

        <Text style={styles.subtitulo}>
          Completa la información para registrarla.
        </Text>

        <Text style={styles.etiqueta}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de la tarea"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.etiqueta}>
          Fecha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD (ej. 2026-10-03)"
          value={fecha}
          onChangeText={setFecha}
          autoCapitalize="none"
        />

        <Text style={styles.etiqueta}>
          Responsable
        </Text>

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
          onPress={guardarTarea}
          disabled={guardando}
        >
          <Text style={styles.textoBoton}>
            {guardando
              ? 'Guardando...'
              : 'Guardar tarea'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => router.back()}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar
          </Text>
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
});