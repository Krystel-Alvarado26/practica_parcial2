import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Mis tareas' }}
      />

      <Stack.Screen
        name="nueva-tarea"
        options={{ title: 'Nueva tarea' }}
      />

      <Stack.Screen
        name="editar-tarea"
        options={{ title: 'Editar tarea' }}
      />
    </Stack>
  );
}
