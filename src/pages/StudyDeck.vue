<template>
  <Layout>
    <!-- Loading state -->
    <section
      v-if="!ready"
      class="flex items-center justify-center min-h-[70vh] text-center"
      role="status"
      aria-live="polite"
    >
      <p class="text-gray-600 dark:text-gray-300">Loading deck…</p>
    </section>

    <!-- Study UI -->
    <section v-else-if="deck" aria-labelledby="study-heading">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1 id="study-heading" class="text-xl font-semibold text-gray-800 dark:text-white">
          Study Deck
        </h1>

        <RouterLink
          to="/dashboard"
          class="text-base sm:text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
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
          <div>
            <h2 class="text-lg font-semibold text-gray-700 dark:text-white">
              {{ deck?.title }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Card {{ currentIndex + 1 }} of {{ deck.cards.length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Study Area -->
      <section class="flex flex-col items-center justify-center flex-1 text-center">
        <!-- Instructions -->
        <!-- Mobile Instructions -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:hidden">
          Tap to reveal the answer. Swipe to switch cards.
        </p>

        <!-- Desktop Instructions -->
        <p class="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mb-4">
          Click the card or press Enter/Space to see the answer.
        </p>

        <!-- Flip Card -->
        <div
          class="flip-card w-full max-w-md h-64 sm:h-72 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          @click="toggleAnswer"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          role="button"
          tabindex="0"
          :aria-pressed="showAnswer"
          aria-label="Flashcard. Press to reveal or hide the answer."
          aria-keyshortcuts="Space Enter"
        >
          <div
            class="flip-card-inner w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
            :class="{ '[transform:rotateY(180deg)]': showAnswer }"
          >
            <!-- Front (Question) -->
            <div
              class="absolute inset-0 flex flex-col p-6 rounded-lg shadow bg-white dark:bg-gray-800 [backface-visibility:hidden] overflow-y-auto"
              :class="
                deck.cards[currentIndex].question.length < 120
                  ? 'justify-center items-center text-center'
                  : 'justify-start items-start text-left'
              "
            >
              <div aria-live="polite" class="w-full">
                <p
                  class="text-xl sm:text-lg font-semibold text-gray-800 dark:text-white break-words"
                >
                  {{ deck.cards[currentIndex].question }}
                </p>
              </div>
            </div>

            <!-- Back (Answer) -->
            <div
              class="absolute inset-0 flex flex-col p-6 rounded-lg shadow bg-white dark:bg-gray-800 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto"
              :class="
                deck.cards[currentIndex].answer.length < 350
                  ? 'justify-center items-center text-center'
                  : 'justify-start items-start text-left'
              "
            >
              <p class="text-lg font-medium text-gray-800 dark:text-white break-words">
                {{ deck.cards[currentIndex].answer }}
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          class="w-full max-w-md h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden my-4"
          role="progressbar"
          :aria-valuenow="currentIndex + 1"
          :aria-valuemin="1"
          :aria-valuemax="deck.cards.length"
          aria-label="Study progress"
        >
          <div
            class="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            :style="{ width: ((currentIndex + 1) / deck.cards.length) * 100 + '%' }"
          ></div>
        </div>

        <!-- Controls -->
        <div class="flex gap-4">
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
            :disabled="currentIndex === deck.cards.length - 1"
            aria-label="Go to next card"
            aria-keyshortcuts="ArrowRight"
            :icon="ArrowRightIcon"
            icon-position="right"
            @click="nextCard"
          />
        </div>

        <!-- Screen reader hint -->
        <p class="sr-only" aria-live="polite">
          Use Left and Right Arrow keys to navigate cards. Press Space or Enter to flip the card.
        </p>
      </section>
    </section>

    <!-- Fallback -->
    <section v-else class="flex items-center justify-center min-h-[70vh] text-center">
      <p class="text-gray-600 dark:text-gray-300">Deck not found.</p>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import Layout from '@/components/Layout.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/solid';
import { fetchDeckWithCards } from '@/composables/useDecks';
import type { DeckDetail } from '@/types/types';

const route = useRoute();
const deckId = String(route.params.id);

// Local state for this page
const deck = ref<DeckDetail | null>(null);
const ready = ref(false);

const currentIndex = ref(0);
const showAnswer = ref(false);

const touchStartX = ref(0);
const touchEndX = ref(0);

function toggleAnswer() {
  showAnswer.value = !showAnswer.value;
}

function nextCard() {
  if (deck.value && currentIndex.value < deck.value.cards.length - 1) {
    currentIndex.value++;
    showAnswer.value = false;
  }
}

function prevCard() {
  if (deck.value && currentIndex.value > 0) {
    currentIndex.value--;
    showAnswer.value = false;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!deck.value) return;
  const target = e.target as HTMLElement | null;
  const tag = (target?.tagName || '').toLowerCase();
  const isEditable = tag === 'input' || tag === 'textarea' || (target && target.isContentEditable);
  if (isEditable || e.altKey || e.ctrlKey || e.metaKey) return;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextCard();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevCard();
  } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
    e.preventDefault();
    toggleAnswer();
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown, { passive: false });
  try {
    const d = await fetchDeckWithCards(deckId);
    deck.value = d;
    ready.value = true;
  } catch {
    ready.value = true; // still mark ready so fallback shows
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
  handleSwipe();
}

function handleSwipe() {
  const deltaX = touchEndX.value - touchStartX.value;
  const threshold = 50;
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      prevCard();
    } else {
      nextCard();
    }
  }
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
