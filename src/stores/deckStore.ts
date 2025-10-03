import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
  createDeck,
  deleteDeck as deleteDeckRequest,
  getDeck,
  getDecks,
  updateDeck as updateDeckRequest,
} from '@/services/deckService';
import type { Deck } from '@/types/types';

export const useDeckStore = defineStore('deckStore', () => {
  const decks = ref<Deck[]>([]);
  const hasMore = ref(true);
  const offset = ref(0);
  const batchSize = 12;
  const loading = ref(false);
  const ready = ref(false);

  function resetStore() {
    decks.value = [];
    hasMore.value = true;
    offset.value = 0;
    loading.value = false;
    ready.value = false;
  }

  function isDeckLoaded(deckId: string): boolean {
    return decks.value.some((d) => d.id === deckId);
  }

  async function loadInitialDecks() {
    // Only load if decks are missing or less than batchSize
    if (loading.value) return;

    loading.value = true;
    try {
      // Reset if decks is empty or offset is 0
      if (decks.value.length === 0 || offset.value === 0) {
        decks.value = [];
        offset.value = 0;
        hasMore.value = true;
      }

      const response = await getDecks(offset.value, batchSize);
      const summaries = response.data.decks as Deck[];

      decks.value.push(...summaries);
      hasMore.value = response.data.hasMore;
      offset.value += batchSize;
    } catch (err) {
      console.error('Failed to load decks:', err);
    } finally {
      loading.value = false;
      ready.value = decks.value.length > 0;
    }
  }

  async function loadMoreDecks() {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    try {
      const response = await getDecks(offset.value, batchSize);
      const summaries = response.data.decks as Deck[];
      decks.value.push(...summaries);
      hasMore.value = response.data.hasMore;
      offset.value += batchSize;
    } catch (err) {
      console.error('Failed to load more decks:', err);
    } finally {
      loading.value = false;
    }
  }

  async function addDeck(deck: { title: string }) {
    try {
      const response = await createDeck(deck);
      decks.value.unshift(response.data as Deck);
      ready.value = true;
      return response.data as Deck;
    } catch (err) {
      console.error('Failed to add deck:', err);
      throw err;
    }
  }

  async function updateDeck(updated: Deck) {
    try {
      const response = await updateDeckRequest(updated.id, updated);
      const idx = decks.value.findIndex((d) => d.id === updated.id);
      if (idx !== -1) decks.value[idx] = response.data as Deck;
    } catch (err) {
      console.error('Failed to update deck:', err);
    }
  }

  async function deleteDeck(id: string) {
    try {
      await deleteDeckRequest(id);
      decks.value = decks.value.filter((d) => d.id !== id);

      if (decks.value.length === 0) {
        hasMore.value = false;
        ready.value = false;
      }
    } catch (err) {
      console.error('Failed to delete deck:', err);
      throw err;
    }
  }

  async function fetchDeck(deckId: string): Promise<Deck> {
    try {
      const response = await getDeck(deckId);
      const deck: Deck = response.data;

      const idx = decks.value.findIndex((d) => d.id === deckId);
      if (idx !== -1) {
        decks.value[idx] = deck;
      } else {
        decks.value.push(deck);
      }

      // ⚠️ Do NOT set ready here! It’s a single-deck fetch only
      return deck;
    } catch (err) {
      console.error('Failed to fetch deck:', err);
      throw err;
    }
  }

  return {
    // State
    decks,
    hasMore,
    loading,
    offset,
    batchSize,
    ready,

    // Actions
    resetStore,
    loadInitialDecks,
    loadMoreDecks,
    addDeck,
    updateDeck,
    deleteDeck,
    fetchDeck,

    // Helper
    isDeckLoaded,
  };
});
