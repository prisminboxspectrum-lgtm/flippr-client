<template>
  <div
    class="p-4 rounded-lg shadow bg-white dark:bg-gray-800 flex flex-col justify-between animate-pulse"
    role="group"
    aria-label="Loading deck"
  >
    <!-- Title and count -->
    <div>
      <div class="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <!-- Buttons -->
    <div class="mt-3 grid grid-cols-2 gap-2">
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
