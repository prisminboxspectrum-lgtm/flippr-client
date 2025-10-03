<template>
  <Layout>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
      <h1 id="study-heading" class="text-xl font-semibold text-gray-800 dark:text-white">
        Study Deck
      </h1>
      <RouterLink
        to="/dashboard"
        class="text-base sm:text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-2 rounded"
        aria-label="Return to dashboard"
      >
        ← Back to Dashboard
      </RouterLink>
    </div>

    <!-- Deck Info -->
    <div class="mb-6">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
        aria-live="polite"
      >
        <!-- Deck skeleton -->
        <div v-if="showDeckSkeleton" role="status" aria-live="polite">
          <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div v-else-if="deck">
          <h2
            class="text-lg font-semibold text-gray-700 dark:text-white truncate"
            :title="deck.title"
          >
            {{ deck.title }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
            Card {{ currentIndex + 1 }} of {{ cards.length }}
          </p>
        </div>

        <div v-else>
          <p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">Deck not found.</p>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <p
      id="flip-instructions-mobile"
      class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:hidden text-center"
      aria-live="polite"
    >
      Tap to reveal the answer. Swipe to switch cards.
    </p>
    <p
      id="flip-instructions-desktop"
      class="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mb-4 text-center"
      aria-live="polite"
    >
      Click the card or press Enter/Space to see the answer.
    </p>

    <!-- Study Area -->
    <section class="flex flex-col items-center justify-center flex-1 text-center">
      <!-- Cards skeleton -->
      <div
        v-if="showCardSkeleton"
        class="w-full max-w-md space-y-4"
        role="status"
        aria-live="polite"
      >
        <div class="h-64 sm:h-72 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div class="flex gap-4 justify-center">
          <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="deck && cards.length" class="w-full max-w-md">
        <!-- Flip Card -->
        <div
          class="flip-card w-full h-64 sm:h-72 cursor-pointer"
          role="button"
          tabindex="0"
          :aria-pressed="showAnswer"
          aria-label="Flashcard. Press to reveal or hide the answer."
          aria-describedby="flip-instructions-mobile flip-instructions-desktop"
          aria-keyshortcuts="Space Enter"
          @click="toggleAnswer"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div
            class="flip-card-inner w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
            :class="{ '[transform:rotateY(180deg)]': showAnswer }"
          >
            <!-- Question side -->
            <div
              class="absolute inset-0 flex flex-col p-6 rounded-lg shadow bg-white dark:bg-gray-800 [backface-visibility:hidden] overflow-y-auto"
              :class="
                currentCard?.question?.length < 120
                  ? 'justify-center items-center text-center'
                  : 'justify-start items-start text-left'
              "
              aria-live="polite"
            >
              <p class="text-xl sm:text-lg font-semibold text-gray-800 dark:text-white break-words">
                {{ currentCard?.question }}
              </p>
            </div>

            <!-- Answer side -->
            <div
              class="absolute inset-0 flex flex-col p-6 rounded-lg shadow bg-white dark:bg-gray-800 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto"
              :class="
                currentCard?.answer?.length < 350
                  ? 'justify-center items-center text-center'
                  : 'justify-start items-start text-left'
              "
              aria-live="polite"
            >
              <p class="text-lg font-medium text-gray-800 dark:text-white break-words">
                {{ currentCard?.answer }}
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden my-4"
          role="progressbar"
          :aria-valuenow="currentIndex + 1"
          :aria-valuemin="1"
          :aria-valuemax="cards.length"
          aria-label="Study progress"
          aria-live="polite"
        >
          <div
            class="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            :style="{ width: ((currentIndex + 1) / cards.length) * 100 + '%' }"
          >
            <span class="sr-only"> Card {{ currentIndex + 1 }} of {{ cards.length }} </span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex gap-4 justify-center">
          <BaseButton
            label="Previous"
            variant="secondary"
            :disabled="currentIndex === 0"
            aria-label="Go to previous card"
            aria-keyshortcuts="ArrowLeft"
            :icon="ArrowLeftIcon"
            @click="prevCard"
          />
          <BaseButton
            label="Next"
            variant="primary"
            :disabled="currentIndex === cards.length - 1"
            aria-label="Go to next card"
            aria-keyshortcuts="ArrowRight"
            :icon="ArrowRightIcon"
            icon-position="right"
            @click="nextCard"
          />
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-center min-h-[70vh] text-center"
        role="status"
        aria-live="polite"
      >
        <p class="text-gray-600 dark:text-gray-300">No cards to study.</p>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/solid';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import Layout from '@/components/Layout.vue';
import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';

const route = useRoute();
const deckId = String(route.params.id);

const deckStore = useDeckStore();
const cardStore = useCardStore();

const deck = computed(() => deckStore.decks.find((d) => d.id === deckId) ?? null);
const cards = computed(() => cardStore.getCards(deckId));

const currentIndex = ref(0);
const showAnswer = ref(false);

// Skeleton logic
const showDeckSkeleton = computed(() => deckStore.loading || !deck.value);
const showCardSkeleton = computed(
  () => cardStore.isLoading || !deck.value || cards.value.length === 0
);

// Current card
const currentCard = computed(() => cards.value[currentIndex.value]);

// Touch support
const touchStartX = ref(0);
const touchEndX = ref(0);

function toggleAnswer() {
  showAnswer.value = !showAnswer.value;
}

function nextCard() {
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++;
    showAnswer.value = false;
  }
}

function prevCard() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    showAnswer.value = false;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!deck.value || !cards.value.length) return;
  const target = e.target as HTMLElement | null;
  const tag = (target?.tagName || '').toLowerCase();
  const isEditable = tag === 'input' || tag === 'textarea' || (target && target.isContentEditable);
  if (isEditable || e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      nextCard();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      prevCard();
      break;
    case ' ':
    case 'Spacebar':
    case 'Enter':
      e.preventDefault();
      toggleAnswer();
      break;
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown, { passive: false });

  try {
    if (!deckStore.isDeckLoaded(deckId)) deckStore.loading = true;
    if (!cardStore.isCardsLoaded(deckId)) cardStore.isLoading = true;

    await Promise.all([
      deckStore.isDeckLoaded(deckId) ? null : deckStore.fetchDeck(deckId),
      cardStore.isCardsLoaded(deckId) ? null : cardStore.fetchCards(deckId),
    ]);
  } finally {
    deckStore.loading = false;
    cardStore.isLoading = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0].screenX;
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX;
  const deltaX = touchEndX.value - touchStartX.value;
  if (Math.abs(deltaX) > 50) deltaX > 0 ? prevCard() : nextCard();
}
</script>

<style>
.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}
.flip-card-inner > div {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
