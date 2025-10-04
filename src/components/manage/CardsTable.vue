<template>
  <div>
    <!-- Skeleton Table -->
    <div
      v-if="loading"
      class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <table class="min-w-full text-xs sm:text-sm text-left text-gray-700 dark:text-gray-200">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-3 sm:px-4 py-2 sm:py-3 font-semibold">Question</th>
            <th class="px-3 sm:px-4 py-2 sm:py-3 font-semibold">Answer</th>
            <th class="px-3 sm:px-4 py-2 sm:py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
          <tr v-for="n in SKELETON_ROW_COUNT" :key="n">
            <td class="px-3 sm:px-4 py-2 sm:py-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </td>
            <td class="px-3 sm:px-4 py-2 sm:py-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            </td>
            <td class="px-3 sm:px-4 py-2 sm:py-3 text-right">
              <div
                class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 inline-block animate-pulse"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards Table -->
    <div
      v-else-if="cards.length > 0"
      class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <table class="min-w-full text-xs sm:text-sm text-left text-gray-700 dark:text-gray-200">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-3 sm:px-4 py-2 sm:py-3 font-semibold">Question</th>
            <th class="px-3 sm:px-4 py-2 sm:py-3 font-semibold">Answer</th>
            <th class="px-3 sm:px-4 py-2 sm:py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
          <tr v-for="card in cards" :key="card.id">
            <td
              class="px-3 sm:px-4 py-2 sm:py-3 max-w-[10rem] sm:max-w-xs truncate"
              :title="card.question"
            >
              {{ card.question }}
            </td>
            <td
              class="px-3 sm:px-4 py-2 sm:py-3 max-w-[12rem] sm:max-w-sm truncate text-gray-600 dark:text-gray-300"
              :title="card.answer"
            >
              {{ card.answer }}
            </td>
            <td class="px-3 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">
              <BaseIconButton
                ariaLabel="Edit card"
                colorClass="text-blue-600 hover:text-blue-800"
                @click="handleEdit(card)"
              >
                <PencilIcon class="h-4 w-4" />
              </BaseIconButton>

              <BaseIconButton
                ariaLabel="Delete card"
                colorClass="text-red-600 hover:text-red-800 ml-2"
                @click="handleDelete(card)"
              >
                <TrashIcon class="h-4 w-4" />
              </BaseIconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-else
      role="status"
      aria-live="polite"
      class="py-8 flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400"
    >
      <img
        :src="emptyIllustration"
        alt="No cards"
        class="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 object-contain dark:invert"
      />
      <p class="text-sm sm:text-base text-center">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';

import BaseIconButton from '@/components/base/BaseIconButton.vue';
import type { Card } from '@/types/types';

defineProps<{
  cards: Card[];
  loading: boolean;
  emptyMessage: string;
  emptyIllustration: string;
}>();

const SKELETON_ROW_COUNT = 4;

const emit = defineEmits<{
  'card-edit': [card: Card];
  'card-delete': [card: Card];
}>();

function handleEdit(card: Card) {
  emit('card-edit', card);
}

function handleDelete(card: Card) {
  emit('card-delete', card);
}
</script>
