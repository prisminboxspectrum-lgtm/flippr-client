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
          <div v-if="isLoading">
            <!-- Skeleton: title -->
            <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <!-- Skeleton: card count -->
            <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

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

            <p class="text-sm text-gray-600 dark:text-gray-400">{{ cards.length }} cards</p>
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
        ref="searchInputRef"
        v-model="cardSearch"
        placeholder="Search cards…"
        class="mb-4"
      />

      <!-- Cards List -->
      <div
        class="overflow-x-auto sm:overflow-visible border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <table
          class="w-full text-sm text-left text-gray-700 dark:text-gray-200 rounded-lg overflow-hidden"
        >
          <caption class="sr-only">
            List of flashcards in this deck
          </caption>

          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr class="rounded-t-lg">
              <th
                scope="col"
                class="px-4 py-3 font-semibold first:rounded-tl-lg last:rounded-tr-lg"
              >
                Question
              </th>
              <th scope="col" class="px-4 py-3 font-semibold">Answer</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <!-- Skeleton rows -->
            <template v-if="isLoading">
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
            </template>

            <!-- Real cards -->
            <template v-else>
              <tr v-if="filteredCards.length === 0">
                <td colspan="3" class="px-4 py-3 text-gray-500 dark:text-gray-400">
                  No matching cards found.
                </td>
              </tr>

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
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modals (unchanged) -->
    <BaseModal
      :is-open="isAddCardOpen"
      title="Add New Card"
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
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import CardForm from '@/components/CardForm.vue';
import Layout from '@/components/Layout.vue';
import SearchInput from '@/components/SearchInput.vue';
import { useCards } from '@/composables/useCards';
import {
  deleteDeck as deleteDeckFromStore,
  fetchDeckWithCards,
  updateDeck as updateDeckInStore,
} from '@/composables/useDecks';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useToast } from '@/composables/useToast';
import type { Card, DeckDetail } from '@/types/types';

// Router + params
const route = useRoute();
const router = useRouter();
const deckId = route.params.id as string;

// Reactive state
const deck = ref<DeckDetail | null>(null);
const isLoading = ref(true);

// Cards
const { cards, fetchCards, addCard, editCard, removeCard } = useCards(deckId);
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

// Search input ref for shortcut (component instance, same as Dashboard)
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null);

// Handle '/' shortcut to focus search input
function handleShortcut(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  const tag = (target?.tagName || '').toLowerCase();
  const isEditable = tag === 'input' || tag === 'textarea' || target?.isContentEditable;
  if (isEditable || e.altKey || e.ctrlKey || e.metaKey) return;

  if (e.key === '/') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleShortcut, { passive: false });

  try {
    const d = await fetchDeckWithCards(deckId);
    deck.value = d;
    editedTitle.value = d.title;
    await fetchCards();
  } catch {
    showError('Failed to load deck.');
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut);
});

// Deck title editing
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
      await updateDeckInStore({ ...deck.value, title: newTitle });
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

// Add / Edit card modals
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
    await addCard({ question: q, answer: a });
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
    await editCard(editedCard.value.id, { question: q, answer: a });
    success(`Card "${q}" updated successfully!`);
  } catch {
    showError('Failed to update card.');
  } finally {
    closeEditCardModal();
  }
}

// Delete deck / card
async function deleteDeck(e: Event) {
  e.preventDefault();
  if (!deck.value) return;

  try {
    await deleteDeckFromStore(deckId);
    success(`Deck "${deck.value.title}" deleted successfully!`);
    router.push('/dashboard');
  } catch {
    showError('Failed to delete deck.');
  } finally {
    isDeleteOpen.value = false;
  }
}

async function deleteCard(card: Card) {
  try {
    await removeCard(card.id);
    success(`Card "${card.question}" deleted.`);
  } catch {
    showError('Failed to delete card.');
  }
}
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
