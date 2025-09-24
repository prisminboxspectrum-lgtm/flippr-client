<template>
  <div class="relative w-full sm:max-w-xs">
    <label :for="id" class="sr-only">Search</label>
    <input
      :id="id"
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
      class="form-control"
      aria-label="Search"
      @input="onInput"
    />
    <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
      <MagnifyingGlassIcon class="h-4 w-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';

withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    id?: string;
  }>(),
  {
    placeholder: 'Search...',
    id: 'search-input',
  }
);

const emit = defineEmits(['update:modelValue']);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit('update:modelValue', target.value);
  }
}
</script>
