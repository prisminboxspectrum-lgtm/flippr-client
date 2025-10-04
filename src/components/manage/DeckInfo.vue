<template>
  <div aria-live="polite" role="status" class="mb-6">
    <!-- Title & Edit -->
    <div class="flex items-center gap-2 flex-wrap">
      <template v-if="!isEditing">
        <h2
          v-if="deck && !showSkeleton"
          class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white truncate max-w-full"
        >
          {{ deck.title }}
        </h2>
        <div
          v-else
          class="h-6 w-32 sm:w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
        ></div>
        <button
          v-if="deck && !showSkeleton"
          type="button"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          aria-label="Rename deck"
          @click="startEditing"
        >
          <PencilIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </template>
      <template v-else>
        <input
          ref="inputRef"
          v-model="editedTitle"
          type="text"
          maxLength="50"
          class="inline-block w-auto max-w-full min-w-[4ch] text-lg sm:text-xl font-semibold bg-transparent dark:bg-transparent px-1 border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          aria-label="Edit deck title"
        />
      </template>
    </div>
    <!-- Card Count -->
    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
      <span
        v-if="!deck || showSkeleton"
        class="inline-block h-4 w-14 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
      ></span>
      <span v-else>{{ cardCountDisplay }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon } from '@heroicons/vue/24/solid';
import { computed, nextTick, ref } from 'vue';

import type { Deck } from '@/types/types';

const props = defineProps<{
  deck: Deck | null;
  showSkeleton?: boolean;
  cardCount: number;
}>();

const emit = defineEmits<{
  'deck-update-title': [newTitle: string];
}>();

// Title editing state
const isEditing = ref(false);
const editedTitle = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// Computed for card count display
const cardCountDisplay = computed(() => {
  const count = props.cardCount || 0;
  return `${count} card${count === 1 ? '' : 's'}`;
});

// Methods
function startEditing() {
  if (!props.deck) return;
  editedTitle.value = props.deck.title;
  isEditing.value = true;
  nextTick(() => inputRef.value?.focus());
}

function saveTitle() {
  if (!props.deck) return;
  const newTitle = editedTitle.value.trim() || 'Untitled Deck';
  if (newTitle !== props.deck.title) {
    emit('deck-update-title', newTitle);
  }
  editedTitle.value = newTitle;
  isEditing.value = false;
}
</script>
