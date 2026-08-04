<script setup>
// Componente raíz
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navbar simple -->
    <nav class="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="font-bold text-xl tracking-tight">
              Moodle Dashboard SPA
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Router View para las vistas -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
/* Estilos globales específicos del App si los hay, aunque usamos Tailwind */
</style>
