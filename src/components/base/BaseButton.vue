<template>
  <button
    :type="type"
    :form="form"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="[baseClasses, variantClasses]"
  >
    <component
      :is="icon"
      v-if="icon && iconPosition === 'left'"
      class="w-4 h-4"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
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
import { computed } from 'vue';

import { buttonVariants } from '@/utils/variants';

interface Props {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: Component | null;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  ariaLabel: undefined,
  iconPosition: 'left',
  icon: null,
  type: 'button',
  form: undefined,
});

const baseClasses =
  'inline-flex items-center justify-center gap-2 px-3 py-2 text-base sm:text-sm font-medium rounded transition-colors duration-200';

const variantClasses = computed(() => {
  const variant = buttonVariants[props.variant];
  return props.disabled ? variant.disabled : variant.base;
});
</script>
