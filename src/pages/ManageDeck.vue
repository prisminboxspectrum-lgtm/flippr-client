<template>
  <Layout>
    <section aria-labelledby="manage-heading" role="region">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1
          id="manage-heading"
          class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white"
        >
          Manage Deck
        </h1>

        <RouterLink
          to="/dashboard"
          class="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 px-2 py-1 rounded"
          aria-label="Return to dashboard"
        >
          ← Back to Dashboard
        </RouterLink>
      </div>

      <!-- Deck Info -->
      <DeckInfo
        :deck="deck"
        :showSkeleton="showDeckSkeleton"
        :cardCount="cardCountNumber"
        @updateTitle="handleUpdateTitle"
      />

      <!-- Actions -->
      <div class="mb-4 flex flex-col sm:flex-row gap-2">
        <BaseButton
          label="Add Card"
          variant="primary"
          :icon="PlusIcon"
          aria-label="Add a new card to this deck"
          @click="isAddCardOpen = true"
        />
        <BaseButton
          label="Delete Deck"
          variant="danger"
          :icon="TrashIcon"
          aria-label="Delete this deck"
          @click="isDeleteOpen = true"
        />
      </div>

      <!-- Search -->
      <SearchInput
        id="search-cards"
        v-model="cardSearch"
        placeholder="Search cards…"
        class="mb-4"
      />

      <!-- Cards Table / Empty State -->
      <transition name="fade" mode="out-in">
        <div>
          <!-- Skeleton rows -->
          <div
            v-if="showCardSkeleton"
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
                <tr v-for="n in 4" :key="n">
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

          <!-- Cards exist -->
          <div
            v-else-if="hasCards"
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
                <tr v-for="card in filteredCards" :key="card.id">
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
                    <button
                      type="button"
                      aria-label="Edit card"
                      class="p-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded"
                      @click="openEditCard(card)"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete card"
                      class="p-2 text-red-600 hover:text-red-800 ml-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded"
                      @click="deleteCard(card)"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="showEmptyState"
            role="status"
            aria-live="polite"
            class="py-8 flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400"
          >
            <img
              :src="emptyCardIllustration"
              alt="No cards"
              class="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 object-contain dark:invert"
            />
            <p class="text-sm sm:text-base text-center">{{ emptyCardMessage }}</p>
          </div>
        </div>
      </transition>
    </section>

    <!-- Modals -->
    <BaseModal
      :is-open="isAddCardOpen"
      title="Add a New Card"
      :show-actions="true"
      confirm-label="Add"
      cancel-label="Cancel"
      form-id="addCardForm"
      autofocus-selector="#question"
      @close="closeAddCardModal"
    >
      <form id="addCardForm" @submit="handleAddCard">
        <CardForm v-model="newCard" />
      </form>
    </BaseModal>

    <BaseModal
      :is-open="isEditCardOpen"
      title="Edit Card"
      :show-actions="true"
      confirm-label="Save"
      cancel-label="Cancel"
      form-id="editCardForm"
      autofocus-selector="#question"
      @close="closeEditCardModal"
    >
      <form id="editCardForm" @submit="saveEditedCard">
        <CardForm v-model="editedCard" />
      </form>
    </BaseModal>

    <BaseModal
      :is-open="isDeleteOpen"
      title="Delete Deck"
      :show-actions="true"
      confirm-label="Delete"
      cancel-label="Cancel"
      form-id="deleteDeckForm"
      @close="isDeleteOpen = false"
    >
      <form id="deleteDeckForm" @submit="deleteDeck">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this deck? This action cannot be undone.
        </p>
      </form>
    </BaseModal>
  </Layout>
</template>

<script setup lang="ts">
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import CardForm from '@/components/CardForm.vue';
import DeckInfo from '@/components/DeckInfo.vue';
import Layout from '@/components/Layout.vue';
import SearchInput from '@/components/SearchInput.vue';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useToast } from '@/composables/useToast';
import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';
import type { Card, Deck } from '@/types/types';

const route = useRoute();
const router = useRouter();
const deckId = String(route.params.id);

const deckStore = useDeckStore();
const cardStore = useCardStore();
const { decks } = storeToRefs(deckStore);

// Deck & cards
const deck = computed<Deck | null>(() => decks.value.find((d) => d.id === deckId) ?? null);
const cards = computed(() => cardStore.getCards(deckId));

// Search
const { query: cardSearch, filtered: filteredCards } = useSearchFilter(cards, ['question']);

// Skeleton / empty logic
const showDeckSkeleton = computed(() => deckStore.loading || !deck.value);
// Skeleton: show only while loading AND only if deck already has cards
const showCardSkeleton = computed(() => {
  if (cardStore.isLoading) {
    // If we don't know deck yet, or deck has cards, show skeleton
    if (!deck.value || (deck.value.cardCount ?? 0) > 0) {
      return true;
    }
  }
  return false;
});

// Cards exist (once loaded)
const hasCards = computed(() => {
  return !cardStore.isLoading && filteredCards.value.length > 0;
});

// Empty state:
// - deck is new (cardCount = 0) -> show empty immediately
// - or deck is existing, cards are done loading, and none found
const showEmptyState = computed(() => {
  if (deck.value && (deck.value.cardCount ?? 0) === 0) {
    // Brand-new deck, no need to flash skeleton
    return true;
  }

  // Existing deck: only show empty if we’re done loading AND nothing found
  return !cardStore.isLoading && filteredCards.value.length === 0;
});

async function handleUpdateTitle(newTitle: string) {
  if (!deck.value) return;
  try {
    await deckStore.updateDeck({ ...deck.value, title: newTitle });
    deck.value.title = newTitle;
    deck.value.dateUpdated = new Date().toISOString();
    success(`Deck renamed to "${newTitle}"`);
  } catch {
    showError('Failed to update deck title.');
  }
}

// Empty illustration
import emptyCardSvg from '@/assets/empty_card.svg';
const emptyCardIllustration = emptyCardSvg;

const emptyCardMessage = computed(() => {
  if (showCardSkeleton.value) return '';
  return cards.value.length === 0
    ? 'No cards yet. Click Add Card to create your first one.'
    : 'No matching cards found.';
});

// Numeric value for DeckInfo prop
const cardCountNumber = computed(() => {
  if (!deck.value) return 0;
  return cardStore.getCards(deckId).length || deck.value.cardCount || 0;
});

// Toast
const { success, error: showError } = useToast();

// Modals
const isAddCardOpen = ref(false);
const isDeleteOpen = ref(false);
const isEditCardOpen = ref(false);

// Card state
const newCard = ref({ question: '', answer: '' });
const blankCard: Card = {
  id: '',
  deckId: '',
  userId: '',
  question: '',
  answer: '',
  dateCreated: '',
  dateUpdated: '',
};
const editedCard = ref<Card>({ ...blankCard });

// Modals helpers
function closeAddCardModal() {
  isAddCardOpen.value = false;
  newCard.value = { question: '', answer: '' };
}

function openEditCard(card: Card) {
  if (!card.id) return;
  editedCard.value = { ...card };
  isEditCardOpen.value = true;
}

function closeEditCardModal() {
  isEditCardOpen.value = false;
  editedCard.value = { ...blankCard };
}

// Card actions
async function handleAddCard(e: Event) {
  e.preventDefault();
  const q = newCard.value.question.trim();
  const a = newCard.value.answer.trim();
  if (!q || !a) return;

  try {
    await cardStore.addCard(deckId, { question: q, answer: a });
    success(`Card "${q}" added successfully!`);
  } catch {
    showError('Failed to add card.');
  } finally {
    closeAddCardModal();
  }
}

async function saveEditedCard(e: Event) {
  e.preventDefault();
  const q = editedCard.value.question.trim();
  const a = editedCard.value.answer.trim();
  if (!editedCard.value.id || !q || !a) return showError('Cannot update card');

  try {
    await cardStore.editCard(deckId, editedCard.value.id, { question: q, answer: a });
    success(`Card "${q}" updated successfully!`);
  } catch {
    showError('Failed to update card.');
  } finally {
    closeEditCardModal();
  }
}

async function deleteDeck(e: Event) {
  e.preventDefault();
  if (!deck.value) return;

  const title = deck.value.title;
  try {
    await deckStore.deleteDeck(deckId);
    success(`Deck "${title}" deleted successfully!`);
    router.push('/dashboard');
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to delete deck.');
  } finally {
    isDeleteOpen.value = false;
  }
}

async function deleteCard(card: Card) {
  try {
    await cardStore.removeCard(deckId, card.id);
    success({
      message: `Card "${card.question}" deleted.`,
      action: {
        label: 'UNDO',
        onClick: () => cardStore.undoDeleteCard(deckId),
      },
    });
  } catch {
    showError('Failed to delete card.');
  }
}

// Fetch deck + cards
onMounted(async () => {
  try {
    if (!deck.value) deckStore.loading = true;

    if (!cardStore.isCardsLoaded(deckId)) {
      cardStore.isLoading = true;
    }

    await Promise.all([
      deck.value ? null : deckStore.fetchDeck(deckId),
      cardStore.isCardsLoaded(deckId) ? null : cardStore.fetchCards(deckId),
    ]);
  } catch (err) {
    console.error('Error fetching deck or cards:', err);
    showError('Failed to load deck or cards.');
  } finally {
    deckStore.loading = false;
    cardStore.isLoading = false;
  }
});
</script>
