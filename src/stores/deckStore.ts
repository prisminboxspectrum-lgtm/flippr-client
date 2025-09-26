import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
  createDeck,
  deleteDeck as deleteDeckRequest,
  getDecks,
  getDeckWithCards,
  updateDeck as updateDeckRequest,
} from '@/services/deckService';
import type { DeckDetail, DeckSummary } from '@/types/types';

export const useDeckStore = defineStore('deckStore', () => {
  const decks = ref<DeckSummary[]>([]);
  const deckDetails = ref<Record<string, DeckDetail>>({});

  const hasMore = ref(true);
  const offset = ref(0);
  const batchSize = 12;
  const loading = ref(false);
  const ready = ref(false);

  function resetStore() {
    decks.value = [];
    deckDetails.value = {};
    hasMore.value = true;
    offset.value = 0;
    loading.value = false;
    ready.value = false;
  }

  function toSummary(deck: DeckDetail): DeckSummary {
    return {
      id: deck.id,
      title: deck.title,
      dateCreated: deck.dateCreated,
      dateUpdated: deck.dateUpdated,
      cardCount: deck.cards.length,
    };
  }

  function isDeckLoaded(deckId: string): boolean {
    const deck = deckDetails.value[deckId];
    return !!deck && Array.isArray(deck.cards) && deck.cards.length > 0;
  }

  async function loadInitialDecks() {
    loading.value = true;

    if (ready.value && decks.value.length >= batchSize) {
      loading.value = false;
      return;
    }

    decks.value = [];
    offset.value = 0;
    hasMore.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
      const response = await getDecks(offset.value, batchSize);
      const summaries = response.data.decks as DeckSummary[];
      decks.value.push(...summaries);
      hasMore.value = response.data.hasMore;
      offset.value += batchSize;
      ready.value = true;
    } catch (err) {
      console.error('Failed to load decks:', err);
    } finally {
      loading.value = false;
    }
  }

  async function loadMoreDecks() {
    try {
      const response = await getDecks(offset.value, batchSize);
      const summaries = response.data.decks as DeckSummary[];
      decks.value.push(...summaries);
      hasMore.value = response.data.hasMore;
      offset.value += batchSize;
    } catch (err) {
      console.error('Failed to load more decks:', err);
    }
  }

  async function loadDecksBatch(offsetParam = 0, limit = 12) {
    try {
      const response = await getDecks(offsetParam, limit);
      const { decks: newDecks, hasMore: more } = response.data;
      hasMore.value = more;
      decks.value.push(...newDecks);
      ready.value = true;
    } catch (err) {
      console.error('Failed to load decks:', err);
    }
  }

  async function createNewDeck(title: string) {
    try {
      const response = await createDeck({ title });
      decks.value.unshift(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to create deck:', err);
      throw err;
    }
  }

  async function addDeck(deck: { title: string }) {
    try {
      const response = await createDeck(deck);
      decks.value.unshift(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to create deck:', err);
      throw err;
    }
  }

  async function updateDeck(updated: DeckSummary | DeckDetail) {
    const summary = 'cards' in updated ? toSummary(updated) : updated;
    try {
      const response = await updateDeckRequest(summary.id, summary);
      const idx = decks.value.findIndex((d) => d.id === summary.id);
      if (idx !== -1) decks.value[idx] = response.data;
    } catch (err) {
      console.error('Failed to update deck:', err);
    }
  }

  async function deleteDeck(id: string) {
    try {
      await deleteDeckRequest(id);
      decks.value = decks.value.filter((d) => d.id !== id);
      delete deckDetails.value[id];
    } catch (err) {
      console.error('Failed to delete deck:', err);
      throw err; // important
    }
  }

  async function fetchDeckWithCards(deckId: string): Promise<DeckDetail> {
    try {
      const response = await getDeckWithCards(deckId);
      const deckDetail: DeckDetail = response.data;

      // Cache full detail
      deckDetails.value[deckId] = deckDetail;

      // Update summary
      const summary = toSummary(deckDetail);
      const idx = decks.value.findIndex((d) => d.id === deckId);
      if (idx !== -1) {
        decks.value[idx] = summary;
      } else {
        decks.value.push(summary);
      }

      return deckDetail;
    } catch (err) {
      console.error('Failed to fetch deck with cards:', err);
      throw err;
    }
  }

  return {
    // State
    decks,
    deckDetails,
    hasMore,
    loading,
    offset,
    batchSize,
    ready,

    // Actions
    resetStore,
    loadInitialDecks,
    loadMoreDecks,
    loadDecksBatch,
    createNewDeck,
    addDeck,
    updateDeck,
    deleteDeck,
    fetchDeckWithCards,

    // Helper
    isDeckLoaded,
  };
});
