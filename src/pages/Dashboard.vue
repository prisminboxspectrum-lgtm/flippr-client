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
          aria-label="Add a new deck"
          @click="openAddDeck"
        />
      </div>

      <!-- Search Decks -->
      <SearchInput
        ref="searchInputRef"
        id="search-decks"
        v-model="deckSearch"
        placeholder="Search decks…"
        class="mb-4"
      />

      <!-- Rest of your template stays the same -->
      <transition name="fade" mode="out-in">
        <div
          v-if="loadingDecks"
          key="skeletons"
          class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <DeckSkeleton v-for="n in batchSize" :key="n" />
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div
          v-if="!loadingDecks && filteredDecks.length > 0"
          key="decks"
          class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-gray-700 dark:text-gray-300"
        >
          <Deck v-for="deck in filteredDecks" :key="deck.id" :deck="deck" />
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div
          v-if="!loadingDecks && filteredDecks.length === 0"
          key="empty"
          class="text-gray-500 dark:text-gray-400"
        >
          No matching decks found.
        </div>
      </transition>

      <div v-if="hasMore" class="mt-4 text-center">
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
import { onBeforeUnmount, onMounted, ref } from 'vue';

import BaseButton from '@/components/BaseButton.vue';
import BaseModal from '@/components/BaseModal.vue';
import Deck from '@/components/Deck.vue';
import DeckSkeleton from '@/components/DeckSkeleton.vue';
import Layout from '@/components/Layout.vue';
import SearchInput from '@/components/SearchInput.vue';
import { addDeck, decks, hasMore, loadDecksBatch } from '@/composables/useDecks';
import { useSearchFilter } from '@/composables/useSearchFilter';
import { useToast } from '@/composables/useToast';

const { success, error: showError } = useToast();

// Modal + deck state
const showAddDeck = ref(false);
const newDeckTitle = ref('');
// Reference to the SearchInput component (not the input element)
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null);

// Deck search
const { query: deckSearch, filtered: filteredDecks } = useSearchFilter(decks, ['title']);
const batchSize = 12;
let offset = 0;
const loadingDecks = ref(true);

onMounted(async () => {
  offset = 0;
  decks.value = [];
  hasMore.value = true;
  loadingDecks.value = true;
  await loadDecksBatch(offset, batchSize);
  offset += batchSize;
  loadingDecks.value = false;

  window.addEventListener('keydown', handleShortcut, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut);
});

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

async function loadMoreDecks() {
  await loadDecksBatch(offset, batchSize);
  offset += batchSize;
}

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
    const newDeck = await addDeck({ title });
    success(`Deck "${newDeck.title}" created successfully!`);
    newDeckTitle.value = '';
    showAddDeck.value = false;
  } catch {
    showError('Failed to create deck.');
  }
}
</script>
