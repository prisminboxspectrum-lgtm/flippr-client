<template>
  <Layout>
    <section aria-labelledby="deck-heading">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h1 id="deck-heading" class="text-xl font-semibold text-gray-800 dark:text-white">
            My Flashcard Decks
          </h1>
        </div>

        <BaseButton
          label="Add Deck"
          :icon="PlusIcon"
          variant="primary"
          aria-label="Add a new flashcard deck"
          @click="openAddDeck"
        />
      </div>

      <!-- Search Decks -->
      <SearchInput
        id="search-decks"
        v-model="deckSearch"
        placeholder="Search decks…"
        class="mb-4"
      />

      <!-- Deck Grid / Skeleton / Empty State -->
      <transition name="fade" mode="out-in">
        <div key="deck-states">
          <!-- Loading Skeletons -->
          <div v-if="loading" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <DeckSkeleton v-for="n in [...Array(batchSize).keys()]" :key="n" />
          </div>

          <!-- Decks Grid -->
          <div
            v-else-if="filteredDecks.length > 0"
            class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-gray-700 dark:text-gray-300"
          >
            <Deck v-for="deck in filteredDecks ?? []" :key="deck.id" :deck="deck" />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="text-gray-500 dark:text-gray-400 py-8 flex flex-col items-center justify-center gap-4"
          >
            <img
              :src="emptyDeckIllustration"
              alt="No decks"
              class="w-48 h-48 sm:w-56 sm:h-56 object-contain dark:invert"
            />

            <p class="text-sm text-center">
              {{ decks.length === 0 ? 'No decks found.' : 'No matching decks found.' }}
            </p>
          </div>
        </div>
      </transition>

      <!-- Load More -->
      <div v-if="hasMore && filteredDecks.length > 0" class="mt-4 text-center">
        <BaseButton label="Load More" variant="secondary" @click="loadMoreDecks" />
      </div>

      <!-- Add Deck Modal -->
      <BaseModal
        :is-open="showAddDeck"
        title="Add New Deck"
        :show-actions="true"
        confirm-label="Add"
        cancel-label="Cancel"
        form-id="addDeckForm"
        autofocus-selector="input"
        @close="showAddDeck = false"
      >
        <form id="addDeckForm" class="space-y-4" @submit="submitDeck">
          <label for="deckTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Deck Title <span class="text-red-600">*</span>
            <input
              id="deckTitle"
              v-model="newDeckTitle"
              type="text"
              required
              aria-required="true"
              class="form-control mt-1"
              placeholder="e.g. Physics"
              aria-label="Deck title"
            />
          </label>
        </form>
      </BaseModal>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/20/solid';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import BaseButton from '@/components/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import Deck from '@/components/Deck.vue';
import DeckSkeleton from '@/components/DeckSkeleton.vue';
import Layout from '@/components/Layout.vue';
import SearchInput from '@/components/SearchInput.vue';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/authStore';
import { useDeckStore } from '@/stores/deckStore';

// Stores
const deckStore = useDeckStore();
const authStore = useAuthStore();
const { decks, hasMore, loading } = storeToRefs(deckStore);
const batchSize = deckStore.batchSize;

// Toast
const { success, error: showError } = useToast();

// Deck actions
const { loadInitialDecks, loadMoreDecks, createNewDeck } = deckStore;

// Add deck modal
const showAddDeck = ref(false);
const newDeckTitle = ref('');

// Search filter
const { query: deckSearch, filtered: filteredDecks } = useSearchFilter(decks, ['title']);

// Empty state
import emptyDeckSvg from '@/assets/empty_deck.svg';
const emptyDeckIllustration = emptyDeckSvg;

// Lifecycle
onMounted(async () => {
  if (authStore.isLoggedIn) {
    if (!deckStore.ready) {
      await loadInitialDecks();
    }
  }
});

// Methods
function openAddDeck() {
  showAddDeck.value = true;
}

async function submitDeck(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  if (!form.checkValidity()) return;

  const title = newDeckTitle.value.trim();
  if (!title) return;

  try {
    const newDeck = await createNewDeck(title);
    success(`Deck "${newDeck.title}" created successfully!`);
    newDeckTitle.value = '';
    showAddDeck.value = false;
  } catch {
    showError('Failed to create deck.');
  }
}
</script>
