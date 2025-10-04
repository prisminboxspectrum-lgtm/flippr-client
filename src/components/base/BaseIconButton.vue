<template>
  <button
    :aria-label="ariaLabel"
    type="button"
    class="p-2 rounded"
    :class="colorClass"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  ariaLabel: string;
  colorClass?: string;
}>();

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  emit('click');
}
</script>
