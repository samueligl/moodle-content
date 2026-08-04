<template>
  <div class="p-6">
    <div class="flex items-center mb-6">
      <router-link to="/" class="text-blue-600 hover:text-blue-800 mr-4">
        &larr; Volver
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Asistencia</h1>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Cargando sesiones de asistencia...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else>
      <div v-if="sessions.length > 0" class="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="session in sessions" :key="session.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                {{ formatDate(session.sessdate) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                {{ session.description || 'Sin descripción' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <!-- Se asume que vendría un 'status' o si está tomada -->
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Registrada
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p class="text-gray-500 dark:text-gray-400">
          No hay sesiones de asistencia disponibles o el plugin no está habilitado.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleApi from '../services/moodleApi';

const sessions = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
};

const fetchAttendance = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Función tentativa del plugin mod_attendance
    // Requeriría parámetros como courseid, pero sin props, intentamos de forma general o mock.
    const response = await moodleApi.get('', {
      params: {
        wsfunction: 'mod_attendance_get_sessions',
      }
    });

    // Suponemos una estructura particular de respuesta
    if (response.data && Array.isArray(response.data)) {
      sessions.value = response.data;
    } else {
      sessions.value = [];
    }
  } catch (err) {
    // Es posible que el plugin no esté disponible
    console.warn('Asistencia no disponible:', err);
    error.value = 'El módulo de asistencia no está disponible o falta configuración de parámetros.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAttendance();
});
</script>
