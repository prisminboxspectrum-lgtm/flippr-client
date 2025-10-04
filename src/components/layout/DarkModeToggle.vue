<template>
  <div class="flex items-center gap-3" :class="wrapperClass">
    <button
      :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out',
        isDark ? 'bg-blue-600' : 'bg-gray-300',
      ]"
      role="switch"
      :aria-checked="isDark"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggle"
    >
      <span class="sr-only">Toggle dark mode</span>
      <span
        :class="[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
          isDark ? 'translate-x-6' : 'translate-x-1',
        ]"
      ></span>
    </button>
    <span class="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
defineProps<{ wrapperClass?: string }>();
const { isDark, toggle } = useTheme();
</script>
