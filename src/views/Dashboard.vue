<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white border-b pb-4">Tus Cursos</h1>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm" role="alert">
      <p class="font-bold">Ocurrió un error</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="course in courses" :key="course.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1">

        <!-- Tarjeta: Header (Imagen/Color) -->
        <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
           <div class="absolute inset-0 bg-black opacity-10"></div>
        </div>

        <!-- Tarjeta: Contenido -->
        <div class="p-6 flex-grow flex flex-col relative bg-white dark:bg-gray-800">
          <h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-2" :title="course.fullname">
            {{ course.fullname }}
          </h2>
          <p class="text-blue-600 dark:text-blue-400 mb-6 text-sm font-semibold uppercase tracking-wide">
            {{ course.shortname }}
          </p>

          <!-- Botones de Acción -->
          <div class="mt-auto space-y-3">
            <router-link :to="`/course/${course.id}`" class="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Ver Contenido
            </router-link>

            <div class="flex space-x-3">
              <router-link to="/events" class="flex-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg text-sm font-medium transition duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Eventos
              </router-link>
              <router-link to="/attendance" class="flex-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg text-sm font-medium transition duration-200">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Asistencia
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      <p class="text-xl text-gray-500 dark:text-gray-400 font-medium">No se encontraron cursos activos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleService from '../services/moodleApi';

const courses = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchCourses = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await moodleService.getCourses();
    // Filtrar la vista del sitio (usualmente ID 1)
    courses.value = data.filter(course => course.id !== 1);
  } catch (err) {
    error.value = err.message || 'No se pudieron cargar los cursos. Verifica tu conexión y configuración.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourses();
});
</script>
