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
        @deck-update-title="updateTitle"
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
      <CardsTable
        :cards="filteredCards"
        :loading="showCardSkeleton"
        :empty-message="emptyCardMessage"
        :empty-illustration="emptyCardIllustration"
        @card-edit="openEditCard"
        @card-delete="deleteCard"
      />
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
      @modal-close="closeAddCardModal"
    >
      <form id="addCardForm" @submit.prevent="handleAddCard">
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
      @modal-close="closeEditCardModal"
    >
      <form id="editCardForm" @submit.prevent="saveEditedCard">
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
      :confirm-aria-described-by="'deleteDeckWarning'"
      @modal-close="isDeleteOpen = false"
    >
      <form id="deleteDeckForm" @submit.prevent="deleteDeck">
        <p id="deleteDeckWarning" class="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this deck? This action cannot be undone.
        </p>
      </form>
    </BaseModal>
  </Layout>
</template>

<script setup lang="ts">
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import SearchInput from '@/components/base/SearchInput.vue';
import Layout from '@/components/layout/Layout.vue';
import CardForm from '@/components/manage/CardForm.vue';
import CardsTable from '@/components/manage/CardsTable.vue';
import DeckInfo from '@/components/manage/DeckInfo.vue';
import { useCardManagement } from '@/composables/useCardManagement';
import { useDeckManagement } from '@/composables/useDeckManagement';
import { useFetchDeckAndCards } from '@/composables/useFetchDeckAndCards';
import { useSearchFilter } from '@/composables/useSearchFilter';

const route = useRoute();
const deckId = String(route.params.id);

// Fetch deck & cards
const { deck, cards, showDeckSkeleton, showCardSkeleton, fetchDeckAndCards } =
  useFetchDeckAndCards(deckId);

// Card management
const {
  isAddCardOpen,
  isEditCardOpen,
  newCard,
  editedCard,
  handleAddCard,
  saveEditedCard,
  deleteCard,
  closeAddCardModal,
  openEditCard,
  closeEditCardModal,
} = useCardManagement(deckId);

// Deck management
const { isDeleteOpen, updateTitle, deleteDeck } = useDeckManagement(deckId);

// Search
const { query: cardSearch, filtered: filteredCards } = useSearchFilter(cards, ['question']);

// Empty illustration
import emptyCardSvg from '@/assets/empty_card.svg';
const emptyCardIllustration = emptyCardSvg;

const emptyCardMessage = computed(() =>
  showCardSkeleton.value
    ? ''
    : cards.value.length
      ? 'No matching cards found.'
      : 'No cards yet. Click Add Card to create your first one.'
);

// Numeric value for DeckInfo prop
const cardCountNumber = computed(() => cards.value.length || deck.value?.cardCount || 0);

// Fetch deck + cards on mount
onMounted(() => {
  fetchDeckAndCards();
});
</script>
