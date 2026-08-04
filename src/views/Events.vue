<template>
  <div class="p-6">
    <div class="flex items-center mb-6">
      <router-link to="/" class="text-blue-600 hover:text-blue-800 mr-4">
        &larr; Volver
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Próximos Eventos</h1>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Cargando eventos...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="event in events" :key="event.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-800 dark:text-white">{{ event.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1" v-html="event.description"></p>
              <div v-if="event.course" class="mt-2 text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block">
                {{ event.course.fullname }}
              </div>
            </div>
            <div class="text-right whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(event.timestart) }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="!loading && !error && events.length === 0" class="text-center py-10">
      <p class="text-gray-500">No hay eventos próximos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleApi from '../services/moodleApi';

const events = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const fetchEvents = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await moodleApi.get('', {
      params: {
        wsfunction: 'core_calendar_get_calendar_events',
      }
    });

    // Suponiendo que los eventos vienen en response.data.events
    if (response.data && Array.isArray(response.data.events)) {
      events.value = response.data.events;
    } else {
      events.value = [];
    }
  } catch (err) {
    error.value = err.message || 'Error al obtener los eventos.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>
