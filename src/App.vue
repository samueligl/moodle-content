<script setup>
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">

    <!-- Topbar Navigation -->
    <nav class="bg-blue-700 dark:bg-blue-900 shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo & Brand -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-3 text-white">
              <svg class="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="font-bold text-xl tracking-tight hidden sm:block">Moodle Dashboard</span>
            </router-link>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link to="/" class="text-white hover:bg-blue-600 dark:hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-blue-800 dark:bg-blue-950">
                Cursos
              </router-link>
              <router-link to="/events" class="text-white hover:bg-blue-600 dark:hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-blue-800 dark:bg-blue-950">
                Eventos
              </router-link>
              <router-link to="/attendance" class="text-white hover:bg-blue-600 dark:hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors" active-class="bg-blue-800 dark:bg-blue-950">
                Asistencia
              </router-link>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="-mr-2 flex md:hidden">
            <button @click="toggleMobileMenu" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white">
              <span class="sr-only">Abrir menú principal</span>
              <svg v-if="!isMobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link @click="toggleMobileMenu" to="/" class="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium" active-class="bg-blue-800">
            Cursos
          </router-link>
          <router-link @click="toggleMobileMenu" to="/events" class="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium" active-class="bg-blue-800">
            Eventos
          </router-link>
          <router-link @click="toggleMobileMenu" to="/attendance" class="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium" active-class="bg-blue-800">
            Asistencia
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Router View for pages with transition -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<style>
/* Transition for router views */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
