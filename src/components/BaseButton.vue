<template>
  <button
    :disabled="disabled"
    :type="'button'"
    :class="[
      'inline-flex items-center justify-center gap-2 px-3 py-2 text-base sm:text-sm font-medium rounded transition-colors duration-200',
      variant === 'primary'
        ? disabled
          ? 'bg-blue-600 text-white opacity-50 cursor-not-allowed pointer-events-none'
          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
        : variant === 'secondary'
          ? disabled
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white opacity-50 cursor-not-allowed pointer-events-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer'
          : variant === 'danger'
            ? disabled
              ? 'bg-red-600 text-white opacity-50 cursor-not-allowed pointer-events-none'
              : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
            : '',
    ]"
    :aria-label="ariaLabel"
  >
    <!-- Icon before label -->
    <component
      :is="icon"
      v-if="icon && iconPosition === 'left'"
      class="w-4 h-4"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
    <!-- Icon after label -->
    <component
      :is="icon"
      v-if="icon && iconPosition === 'right'"
      class="w-4 h-4"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: Component | null;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  ariaLabel: undefined,
  iconPosition: 'left',
  icon: null,
});
</script>
