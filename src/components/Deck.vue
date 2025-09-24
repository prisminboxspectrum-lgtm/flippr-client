<template>
  <div
    class="p-4 rounded-lg shadow bg-white dark:bg-gray-800 flex flex-col justify-between"
    role="group"
    :aria-label="`Deck: ${deck.title}`"
    :aria-describedby="`deck-count-${deck.id}`"
  >
    <!-- Deck title and count -->
    <div>
      <h2 class="text-lg font-semibold text-gray-700 dark:text-white">
        {{ deck.title }}
      </h2>
      <p :id="`deck-count-${deck.id}`" class="text-sm text-gray-600 dark:text-gray-400">
        {{ deck.cardCount }} cards
      </p>
    </div>

    <!-- Actions -->
    <div class="mt-3 grid grid-cols-2 gap-2">
      <!-- Study button -->
      <BaseButton
        label="Study"
        :icon="PlayIcon"
        variant="primary"
        :disabled="deck.cardCount === 0"
        :aria-disabled="deck.cardCount === 0"
        :title="deck.cardCount === 0 ? 'Add cards to enable studying' : 'Start study session'"
        aria-label="Start studying this deck"
        class="justify-center"
        @click="goToStudyDeck"
      />

      <!-- Manage button -->
      <BaseButton
        label="Manage"
        :icon="PencilSquareIcon"
        variant="secondary"
        aria-label="Manage this deck"
        class="justify-center"
        @click="goToManageDeck"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, PlayIcon } from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import type { DeckSummary } from '@/types/types';

const props = defineProps<{
  deck: DeckSummary;
}>();

const router = useRouter();

function goToManageDeck() {
  router.push({ name: 'ManageDeck', params: { id: props.deck.id } });
}

function goToStudyDeck() {
  if (props.deck.cardCount === 0) return;
  router.push({ name: 'StudyDeck', params: { id: props.deck.id } });
}
</script>
