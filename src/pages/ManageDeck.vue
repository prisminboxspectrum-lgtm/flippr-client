<template>
  <Layout>
    <section aria-labelledby="manage-heading" role="region">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1 id="manage-heading" class="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Deck
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
          <!-- Skeletons for deck info -->
          <div v-if="isDeckLoading">
            <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          <!-- Real deck info -->
          <div v-else>
            <div class="flex items-center gap-2">
              <template v-if="!isEditingTitle">
                <h2 class="text-lg font-semibold text-gray-700 dark:text-white">
                  {{ deck?.title || 'Untitled Deck' }}
                </h2>
                <button
                  type="button"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 cursor-pointer"
                  aria-label="Rename deck"
                  @click="startEditingTitle"
                >
                  <PencilIcon class="h-4 w-4" aria-hidden="true" />
                </button>
              </template>

              <template v-else>
                <input
                  ref="titleInput"
                  v-model="editedTitle"
                  type="text"
                  maxLength="50"
                  class="form-control text-lg font-semibold bg-transparent dark:bg-transparent px-1"
                  @blur="saveTitle"
                  @keyup.enter="saveTitle"
                />
              </template>
            </div>

            <!-- Card count -->
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span
                v-if="hasCards && isCardsLoading"
                class="inline-block h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></span>
              <span v-else>{{ cardCountDisplay }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Actions: Add + Delete -->
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

      <!-- Search Cards -->
      <SearchInput
        id="search-cards"
        v-model="cardSearch"
        placeholder="Search cards…"
        class="mb-4"
      />

      <!-- Cards Table / Empty State -->
      <transition name="fade" mode="out-in">
        <div>
          <!-- Skeleton rows (loading or not yet loaded) -->
          <table
            v-if="isCardsLoading || !cardStore.isCardsLoaded(deckId)"
            class="w-full text-sm text-left text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 font-semibold">Question</th>
                <th class="px-4 py-3 font-semibold">Answer</th>
                <th class="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="n in 4" :key="n">
                <td class="px-4 py-3">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div
                    class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 inline-block animate-pulse"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Cards exist -->
          <table
            v-else-if="filteredCards.length > 0"
            class="w-full text-sm text-left text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 font-semibold">Question</th>
                <th class="px-4 py-3 font-semibold">Answer</th>
                <th class="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="card in filteredCards" :key="card.id">
                <td class="px-4 py-3 max-w-xs truncate" :title="card.question">
                  {{ card.question }}
                </td>
                <td
                  class="px-4 py-3 max-w-sm truncate text-gray-600 dark:text-gray-300"
                  :title="card.answer"
                >
                  {{ card.answer }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    aria-label="Edit card"
                    class="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                    @click="openEditCard(card)"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete card"
                    class="p-1 text-red-600 hover:text-red-800 ml-2 cursor-pointer"
                    @click="deleteCard(card)"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State (only when loaded + empty) -->
          <div
            v-else
            class="py-8 flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400"
          >
            <img
              :src="emptyCardIllustration"
              alt="No cards"
              class="w-40 h-40 sm:w-52 sm:h-52 object-contain dark:invert"
            />
            <p class="text-sm text-center">{{ emptyCardMessage }}</p>
          </div>
        </div>
      </transition>
    </section>

    <!-- Modals (unchanged) -->
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
import Layout from '@/components/Layout.vue';
import SearchInput from '@/components/SearchInput.vue';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useToast } from '@/composables/useToast';
import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';
import type { Card } from '@/types/types';

// Router + params
const route = useRoute();
const router = useRouter();
const deckId = String(route.params.id);

// Stores
const deckStore = useDeckStore();
const cardStore = useCardStore();
const { deckDetails } = storeToRefs(deckStore);

// Reactive state
const deck = computed(() => deckDetails.value[deckId] ?? null);
const cards = computed(() => cardStore.getCards(deckId));
const hasCards = computed(() => (cards.value?.length ?? 0) > 0);

// Better card count logic
const cardCountDisplay = computed(() => {
  if (!cardStore.isCardsLoaded(deckId) || isCardsLoading.value) {
    return null; // will show skeleton
  }
  return `${cards.value.length} cards`;
});

// Respect both local loading state + store cache
const isDeckLoading = ref(!deckStore.isDeckLoaded(deckId));
const isCardsLoading = ref(!cardStore.isCardsLoaded(deckId));

// Search
const { query: cardSearch, filtered: filteredCards } = useSearchFilter(cards, ['question']);

// Toast
const { success, error: showError } = useToast();

// Modals
const isAddCardOpen = ref(false);
const isDeleteOpen = ref(false);
const isEditCardOpen = ref(false);

// Card state
const newCard = ref({ question: '', answer: '' });
const blankCard: Card = { id: '', question: '', answer: '', dateCreated: '', dateUpdated: '' };
const editedCard = ref<Card>({ ...blankCard });

// Title editing
const isEditingTitle = ref(false);
const editedTitle = ref('');
const titleInput = ref<HTMLInputElement | null>(null);

function startEditingTitle() {
  if (!deck.value) return;
  editedTitle.value = deck.value.title;
  isEditingTitle.value = true;
  nextTick(() => titleInput.value?.focus());
}

async function saveTitle() {
  if (!deck.value) return;
  let newTitle = editedTitle.value.trim();
  if (!newTitle) newTitle = 'Untitled Deck';

  if (newTitle !== deck.value.title) {
    try {
      await deckStore.updateDeck({ ...deck.value, title: newTitle });
      deck.value.title = newTitle;
      deck.value.dateUpdated = new Date().toISOString();
      success(
        newTitle === 'Untitled Deck'
          ? 'Name cannot be empty, set to "Untitled Deck"'
          : `Deck renamed to "${newTitle}"`
      );
    } catch {
      showError('Failed to update deck title.');
    }
  }

  editedTitle.value = newTitle;
  isEditingTitle.value = false;
}

function closeAddCardModal() {
  isAddCardOpen.value = false;
  newCard.value = { question: '', answer: '' };
}

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

function openEditCard(card: Card) {
  if (!card.id) return console.error('Card has no id:', card);
  editedCard.value = { ...card };
  isEditCardOpen.value = true;
}

function closeEditCardModal() {
  isEditCardOpen.value = false;
  editedCard.value = { ...blankCard };
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
    success(`Card "${card.question}" deleted.`);
  } catch {
    showError('Failed to delete card.');
  }
}

// Empty state only show "No cards" if loaded and empty
import emptyCardSvg from '@/assets/empty_card.svg';
const emptyCardIllustration = emptyCardSvg;
const emptyCardMessage = computed(() => {
  if (!cardStore.isCardsLoaded(deckId) || isCardsLoading.value) {
    return ''; // don’t show message while still loading
  }
  return cards.value.length === 0
    ? 'No cards yet. Click Add Card to create your first one.'
    : 'No matching cards found.';
});

// Load deck + cards
onMounted(async () => {
  try {
    if (!deckStore.isDeckLoaded(deckId)) {
      isDeckLoading.value = true;
      await deckStore.fetchDeckWithCards(deckId);
      isDeckLoading.value = false;
    }

    if (!cardStore.isCardsLoaded(deckId)) {
      isCardsLoading.value = true;
      await cardStore.fetchCards(deckId);
      isCardsLoading.value = false;
    }

    editedTitle.value = deck.value?.title ?? '';
  } catch {
    showError('Failed to load deck.');
    isDeckLoading.value = false;
    isCardsLoading.value = false;
  }
});
</script>
