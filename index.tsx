import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { tareaRepository } from '../repositories/tareaRepository';
import type { Tarea } from '../types/Tarea';

export default function InicioScreen() {
  const router = useRouter();

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarTareas = useCallback(async () => {
    try {
      setCargando(true);

      const datos = await tareaRepository.obtenerTodas();

      setTareas(datos);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las tareas.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarTareas();
    }, [cargarTareas])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis tareas</Text>

      <Text style={styles.subtitulo}>
        Registro de tareas pendientes
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('./nueva-tarea')}
      >
        <Text style={styles.textoBoton}>
          + Nueva tarea
        </Text>
      </TouchableOpacity>

      {cargando ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
        />
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              Todavía no hay tareas registradas.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.nombre}>
                {item.nombre}
              </Text>

              <Text style={styles.fecha}>
                Fecha: {item.fecha}
              </Text>

              <Text style={styles.descripcion}>
                {item.tarea}
              </Text>

              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() =>
                  router.push({
                    pathname: '/editar-tarea',
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <Text style={styles.textoEditar}>
                  Editar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    paddingTop: 35,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  subtitulo: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
    marginBottom: 20,
  },

  boton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  lista: {
    paddingBottom: 20,
  },

  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },

  fecha: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },

  descripcion: {
    fontSize: 16,
    color: '#334155',
  },

  botonEditar: {
    backgroundColor: '#e2e8f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  textoEditar: {
    color: '#334155',
    fontSize: 15,
    fontWeight: 'bold',
  },

  vacio: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 30,
    fontSize: 16,
  },
});
