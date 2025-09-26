<template>
  <div class="relative w-full sm:max-w-xs">
    <label :for="id" class="sr-only">Search</label>
    <input
      ref="inputEl"
      :id="id"
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
      class="form-control"
      aria-label="Search"
      aria-keyshortcuts="/"
      @input="onInput"
    />
    <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
      <MagnifyingGlassIcon class="h-4 w-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';

defineProps<{
  modelValue: string;
  placeholder?: string;
  id?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const inputEl = ref<HTMLInputElement | null>(null);

defineExpose({
  inputEl,
  focus: () => inputEl.value?.focus(),
});

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>
