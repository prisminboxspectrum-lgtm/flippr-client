<template>
  <Layout>
    <section aria-labelledby="manage-heading">
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
          <div>
            <div class="flex items-center gap-2">
              <template v-if="!isEditingTitle">
                <h2 class="text-lg font-semibold text-gray-700 dark:text-white">
                  {{ deck?.title || 'Untitled Deck' }}
                </h2>
                <button
                  type="button"
                  @click="startEditingTitle"
                  class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 cursor-pointer"
                  aria-label="Rename deck"
                >
                  <PencilIcon class="h-4 w-4" aria-hidden="true" />
                </button>
              </template>

              <template v-else>
                <input
                  v-model="editedTitle"
                  type="text"
                  maxLength="50"
                  class="text-lg font-semibold bg-transparent dark:bg-transparent focus:bg-gray-100 dark:focus:bg-gray-700 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @blur="saveTitle"
                  @keyup.enter="saveTitle"
                  ref="titleInput"
                />
              </template>
            </div>

            <!-- Use cards.length from composable -->
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
        v-model="searchQuery"
        placeholder="Search cards…"
        id="search-cards"
        class="mb-4"
      />

      <!-- Cards List -->
      <div
        v-if="filteredCards.length === 0"
        class="text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        No matching cards found.
      </div>
      <div
        v-else
        class="overflow-x-auto sm:overflow-visible rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <table class="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <caption class="sr-only">
            List of flashcards in this deck
          </caption>
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Question</th>
              <th scope="col" class="px-4 py-3 font-semibold">Answer</th>
              <th scope="col" class="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <!-- Iterate over filteredCards (from useSearchFilter(cards)) -->
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
                  @click="openEditCard(card)"
                  aria-label="Edit card"
                  class="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  @click="deleteCard(card)"
                  aria-label="Delete card"
                  class="p-1 text-red-600 hover:text-red-800 ml-2 cursor-pointer"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      @close="isDeleteOpen = false"
      form-id="deleteDeckForm"
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
import { ref, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Layout from '@/components/Layout.vue';
import BaseModal from '@/components/BaseModal.vue';
import CardForm from '@/components/CardForm.vue';
import BaseButton from '@/components/BaseButton.vue';
import SearchInput from '@/components/SearchInput.vue';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useToast } from '@/composables/useToast';
import {
  fetchDeckWithCards,
  deleteDeck as deleteDeckFromStore,
  updateDeck as updateDeckInStore,
} from '@/composables/useDecks';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useCards } from '@/composables/useCards';
import type { Card, DeckDetail } from '@/types/types';

// Router + params
const route = useRoute();
const router = useRouter();
const deckId = route.params.id as string;

// Reactive state for deck
const deck = ref<DeckDetail | null>(null);

// Cards composable
const { cards, fetchCards, addCard, editCard, removeCard } = useCards(deckId);

// Search filter (filter over cards)
const { query: searchQuery, filtered: filteredCards } = useSearchFilter(cards, ['question']);

// Toast
const { success, error: showError } = useToast();

// Modal state
const isAddCardOpen = ref(false);
const isDeleteOpen = ref(false);
const isEditCardOpen = ref(false);

// Card state
const newCard = ref({ question: '', answer: '' });
const blankCard: Card = {
  id: '',
  question: '',
  answer: '',
  dateCreated: '',
  dateUpdated: '',
};
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

  // If empty, enforce default
  if (!newTitle) {
    newTitle = 'Untitled Deck';
  }

  // Only update if something actually changed
  if (newTitle !== deck.value.title) {
    try {
      await updateDeckInStore({ ...deck.value, title: newTitle });
      deck.value.title = newTitle;
      deck.value.dateUpdated = new Date().toISOString();

      // Toast logic
      if (newTitle === 'Untitled Deck' && editedTitle.value.trim() === '') {
        success('Name cannot be empty, set to "Untitled Deck"');
      } else {
        success(`Deck renamed to "${newTitle}"`);
      }
    } catch {
      showError('Failed to update deck title.');
    }
  }

  // Reset editing state
  editedTitle.value = newTitle;
  isEditingTitle.value = false;
}

// Add card
function closeAddCardModal() {
  isAddCardOpen.value = false;
  newCard.value = { question: '', answer: '' };
}

async function handleAddCard(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  if (!form.checkValidity()) return;

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

// Edit card
function openEditCard(card: Card) {
  if (!card.id) {
    console.error('Card has no id:', card);
    return;
  }
  editedCard.value = { ...card };
  isEditCardOpen.value = true;
}

function closeEditCardModal() {
  isEditCardOpen.value = false;
  editedCard.value = { ...blankCard };
}

async function saveEditedCard(e: Event) {
  e.preventDefault();
  if (!editedCard.value.id) {
    showError('Cannot update card: missing id');
    return;
  }
  const q = editedCard.value.question.trim();
  const a = editedCard.value.answer.trim();
  if (!q || !a) return;

  try {
    await editCard(editedCard.value.id, { question: q, answer: a });
    success(`Card "${q}" updated successfully!`);
  } catch {
    showError('Failed to update card.');
  } finally {
    closeEditCardModal();
  }
}

// Delete deck
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

// Delete card
async function deleteCard(card: Card) {
  try {
    await removeCard(card.id);
    success(`Card "${card.question}" deleted.`);
  } catch {
    showError('Failed to delete card.');
  }
}

// Load deck + cards on mount
onMounted(async () => {
  try {
    const d = await fetchDeckWithCards(deckId);
    deck.value = d;
    editedTitle.value = d.title;
    await fetchCards();
  } catch {
    showError('Failed to load deck.');
  }
});
</script>

<style scoped>
/* Transition for card removal */
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
