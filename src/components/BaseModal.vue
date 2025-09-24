<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelId"
      tabindex="-1"
      @keydown.esc="emitClose"
    >
      <div
        ref="modalContent"
        class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg max-w-md w-full p-6"
        @click.stop
      >
        <!-- Title -->
        <header v-if="title" :id="labelId" class="text-lg font-semibold mb-4">
          {{ title }}
        </header>

        <!-- Body -->
        <div class="modal-body">
          <slot></slot>
        </div>

        <!-- Footer -->
        <footer v-if="showActions" class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
            @click="emitClose"
          >
            {{ cancelText }}
          </button>
          <button
            :form="formId"
            type="submit"
            class="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            {{ confirmText }}
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title?: string;
  showActions?: boolean;
  autofocusSelector?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  formId?: string;
}>();

const emit = defineEmits(['close']);

const labelId = computed(() => `modal-title-${Math.random().toString(36).slice(2)}`);
const modalContent = ref<HTMLElement | null>(null);

const confirmText = computed(() => props.confirmLabel ?? 'Confirm');
const cancelText = computed(() => props.cancelLabel ?? 'Cancel');

function emitClose() {
  emit('close');
}

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      await nextTick();
      if (props.autofocusSelector && modalContent.value) {
        const target = modalContent.value.querySelector<HTMLElement>(props.autofocusSelector);
        target?.focus();
      } else {
        modalContent.value?.focus();
      }
    }
  }
);
</script>

<style scoped>
@reference "tailwindcss/theme";

.modal-body input,
.modal-body textarea {
  @apply w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white;
}
</style>
