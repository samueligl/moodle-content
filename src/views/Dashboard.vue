<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard Principal</h1>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Cargando cursos...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white truncate" :title="course.fullname">{{ course.fullname }}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">{{ course.shortname }}</p>

        <div class="flex flex-col space-y-2 mt-auto">
          <router-link :to="`/course/${course.id}`" class="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition duration-200">
            Ver Contenido
          </router-link>

          <div class="flex space-x-2">
            <router-link to="/events" class="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-center py-2 px-4 rounded transition duration-200 flex-1">
              Ver Eventos
            </router-link>
            <router-link to="/attendance" class="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-center py-2 px-4 rounded transition duration-200 flex-1">
              Asistencia
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error && courses.length === 0" class="text-center py-10">
      <p class="text-gray-500">No se encontraron cursos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleApi from '../services/moodleApi';

const courses = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchCourses = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await moodleApi.get('', {
      params: {
        wsfunction: 'core_course_get_courses',
      }
    });

    // Asumiendo que la respuesta es un array de cursos
    const data = response.data;

    if (Array.isArray(data)) {
      // Filtrar el curso ID 1 (vista del sitio)
      courses.value = data.filter(course => course.id !== 1);
    } else {
      console.warn('Estructura de respuesta inesperada:', data);
      // Algunos Moodle devuelven un objeto con una propiedad de arreglo, intentamos adivinar
      if (data && typeof data === 'object' && Array.isArray(data.courses)) {
          courses.value = data.courses.filter(course => course.id !== 1);
      } else {
          courses.value = [];
      }
    }
  } catch (err) {
    error.value = err.message || 'Error al obtener los cursos.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourses();
});
</script>
