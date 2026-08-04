<template>
  <div class="p-6">
    <div class="flex items-center mb-6">
      <router-link to="/" class="text-blue-600 hover:text-blue-800 mr-4">
        &larr; Volver
      </router-link>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Contenido del Curso (ID: {{ id }})</h1>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Cargando contenido...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else class="space-y-4">
      <div v-for="section in sections" :key="section.id" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <button
          @click="toggleSection(section.id)"
          class="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-colors"
        >
          <span class="font-semibold text-lg text-gray-800 dark:text-white">{{ section.name || `Tema ${section.section}` }}</span>
          <span class="transform transition-transform duration-200" :class="{ 'rotate-180': openSections.includes(section.id) }">
            &#9660;
          </span>
        </button>

        <div v-show="openSections.includes(section.id)" class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div v-if="section.summary" v-html="section.summary" class="mb-4 text-gray-600 dark:text-gray-300 text-sm"></div>

          <ul v-if="section.modules && section.modules.length > 0" class="space-y-2">
            <li v-for="module in section.modules" :key="module.id" class="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <img v-if="module.modicon" :src="module.modicon" :alt="module.modname" class="w-6 h-6 mr-3" />
              <a v-if="module.url" :href="module.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                {{ module.name }}
              </a>
              <span v-else class="text-gray-800 dark:text-gray-200">{{ module.name }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500 italic">No hay recursos en esta sección.</p>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error && sections.length === 0" class="text-center py-10">
      <p class="text-gray-500">No hay contenido disponible para este curso.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import moodleApi from '../services/moodleApi';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const sections = ref([]);
const openSections = ref([]);
const loading = ref(true);
const error = ref(null);

const toggleSection = (id) => {
  const index = openSections.value.indexOf(id);
  if (index === -1) {
    openSections.value.push(id);
  } else {
    openSections.value.splice(index, 1);
  }
};

const fetchCourseContent = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await moodleApi.get('', {
      params: {
        wsfunction: 'core_course_get_contents',
        courseid: props.id,
      }
    });

    sections.value = response.data;

    // Abrir la primera sección por defecto
    if (sections.value.length > 0) {
      openSections.value.push(sections.value[0].id);
    }

  } catch (err) {
    error.value = err.message || 'Error al obtener el contenido del curso.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourseContent();
});
</script>
