<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto">
    <div class="flex items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Agenda de Eventos Futuros</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
      <p class="font-bold">No se pudieron cargar los eventos</p>
      <p class="text-sm mt-1">{{ error }}</p>
    </div>

    <div v-else-if="sortedEvents.length > 0" class="space-y-4">
      <div v-for="event in sortedEvents" :key="event.id" class="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-750 overflow-hidden hover:shadow-md transition-shadow">

        <!-- Fecha Destacada Izquierda -->
        <div class="bg-blue-50 dark:bg-blue-900/30 w-full sm:w-32 flex flex-col justify-center items-center py-4 border-b sm:border-b-0 sm:border-r border-blue-100 dark:border-blue-800/50">
          <span class="text-blue-500 font-bold uppercase text-xs tracking-wider mb-1">{{ getMonth(event.timestart) }}</span>
          <span class="text-3xl font-black text-blue-700 dark:text-blue-300 leading-none">{{ getDay(event.timestart) }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ getTime(event.timestart) }}</span>
        </div>

        <!-- Detalles del Evento -->
        <div class="p-5 flex-grow flex flex-col justify-center">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 sm:mb-0 pr-4">{{ event.name }}</h3>
            <span v-if="event.course" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 self-start shrink-0">
              <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
              {{ event.course.shortname || 'Curso' }}
            </span>
          </div>

          <div v-if="event.description" v-html="event.description" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1"></div>

          <div class="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg class="mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ formatRelativeDate(event.timestart) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-full mb-4">
        <svg class="w-12 h-12 text-blue-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">¡Todo al día! No tienes eventos próximos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import moodleService from '../services/moodleApi';

const events = ref([]);
const loading = ref(true);
const error = ref(null);

const sortedEvents = computed(() => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return events.value
    .filter(event => event.timestart >= currentTimestamp)
    .sort((a, b) => a.timestart - b.timestart);
});

// Utilidades de formato de fecha
const getMonth = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(timestamp * 1000));
};

const getDay = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).getDate();
};

const getTime = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp * 1000));
};

const formatRelativeDate = (timestamp) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(new Date(timestamp * 1000));
};

const fetchEvents = async () => {
  loading.value = true;
  error.value = null;

  try {
    events.value = await moodleService.getCalendarEvents();
  } catch (err) {
    error.value = err.message || 'Error al obtener los eventos del servidor.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>
