<template>
  <div class="p-4 sm:p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center">
        <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Registro de Asistencia</h1>
      </div>
      <span class="text-sm text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">Resumen General</span>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>

    <div v-else-if="error" class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-5 rounded-lg shadow-sm flex items-start">
      <svg class="h-6 w-6 text-yellow-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <h3 class="font-bold">Módulo no disponible</h3>
        <p class="text-sm mt-1">{{ error }}</p>
        <p class="text-xs mt-2 text-yellow-600">Nota: El plugin "mod_attendance" necesita estar instalado y configurado en tu plataforma Moodle para que esta sección funcione.</p>
      </div>
    </div>

    <div v-else>
      <div v-if="sessions.length > 0" class="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha / Hora</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <tr v-for="session in sessions" :key="session.id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ formatDate(session.sessdate) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(session.sessdate) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-800 dark:text-gray-200">{{ session.description || 'Sesión Regular' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                    <svg class="-ml-0.5 mr-1.5 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                    Registrada
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center px-4">
        <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Sin Registros</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md">No se encontraron sesiones de asistencia registradas para tu cuenta en este momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleService from '../services/moodleApi';

const sessions = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(timestamp * 1000));
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' }).format(new Date(timestamp * 1000));
};

const fetchAttendance = async () => {
  loading.value = true;
  error.value = null;

  try {
    sessions.value = await moodleService.getAttendanceSessions();
  } catch (err) {
    // Si falla, suele ser porque el plugin de Attendance no existe en ese Moodle
    error.value = 'El módulo de asistencia no respondió o no está configurado correctamente.';
    console.info('Aviso de Asistencia:', err.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAttendance();
});
</script>
