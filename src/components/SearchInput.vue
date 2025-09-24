<template>
  <div class="relative w-full sm:max-w-xs">
    <label :for="id" class="sr-only">Search</label>
    <input
      :id="id"
      :value="modelValue"
      @input="onInput"
      type="search"
      :placeholder="placeholder"
      class="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Search"
    />
    <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
      <MagnifyingGlassIcon class="h-4 w-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';

const { modelValue, placeholder, id } = defineProps<{
  modelValue: string;
  placeholder?: string;
  id?: string;
}>();

const emit = defineEmits(['update:modelValue']);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit('update:modelValue', target.value);
  }
}
</script>
