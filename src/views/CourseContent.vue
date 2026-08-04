<template>
  <div class="p-4 sm:p-6 max-w-5xl mx-auto">
    <!-- Navegación y Título -->
    <div class="flex items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <router-link to="/" class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors p-2 -ml-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver
      </router-link>
      <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-4"></div>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">Contenido del Curso <span class="text-gray-500 text-lg font-normal">#{{ id }}</span></h1>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm" role="alert">
      <div class="flex">
        <svg class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <div>
          <h3 class="text-red-800 font-bold text-sm">Error al cargar contenido</h3>
          <p class="text-red-700 mt-1 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div v-else-if="sections.length > 0" class="space-y-4">
      <div v-for="section in sections" :key="section.id" class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-all duration-200" :class="{ 'ring-2 ring-blue-500/20': openSections.includes(section.id) }">

        <!-- Header Acordeón -->
        <button
          @click="toggleSection(section.id)"
          class="w-full flex justify-between items-center p-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none transition-colors"
        >
          <div class="flex items-center text-left">
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 mr-3">
              Tema {{ section.section }}
            </span>
            <span class="font-bold text-lg text-gray-800 dark:text-white">{{ section.name || 'Sección General' }}</span>
          </div>
          <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-300" :class="{ 'rotate-180 text-blue-500': openSections.includes(section.id) }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        <!-- Cuerpo Acordeón -->
        <transition name="slide-fade">
          <div v-show="openSections.includes(section.id)" class="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-5">

            <div v-if="section.summary" v-html="section.summary" class="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700"></div>

            <div v-if="section.modules && section.modules.length > 0">
              <ul class="space-y-3">
                <li v-for="module in section.modules" :key="module.id" class="group flex items-center p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all">
                  <div class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-4">
                    <img v-if="module.modicon" :src="module.modicon" :alt="module.modname" class="w-6 h-6 object-contain" />
                    <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>

                  <div class="flex-grow min-w-0">
                    <a v-if="module.url" :href="module.url" target="_blank" rel="noopener noreferrer" class="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block truncate">
                      {{ module.name }}
                    </a>
                    <span v-else class="text-base font-medium text-gray-900 dark:text-gray-100 block truncate">{{ module.name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5 block">{{ module.modname }}</span>
                  </div>

                  <a v-if="module.url" :href="module.url" target="_blank" class="ml-4 flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </li>
              </ul>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-6 text-gray-400">
              <svg class="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <p class="text-sm">Sin actividades publicadas en esta sección.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <p class="text-lg text-gray-500 font-medium">Este curso aún no tiene contenido estructurado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moodleService from '../services/moodleApi';

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
    sections.value = await moodleService.getCourseContents(props.id);

    // Auto-abrir la primera sección que tenga módulos o la primera en general
    if (sections.value.length > 0) {
      const sectionWithModules = sections.value.find(s => s.modules && s.modules.length > 0);
      openSections.value.push(sectionWithModules ? sectionWithModules.id : sections.value[0].id);
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

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
