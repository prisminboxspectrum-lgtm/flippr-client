import { defineStore } from 'pinia';
import { ref } from 'vue';

import { createCard, deleteCard, getCardsByDeck, updateCard } from '@/services/cardService';
import { useDeckStore } from '@/stores/deckStore';
import type { Card } from '@/types/types';
const deckStore = useDeckStore();

export const useCardStore = defineStore('cardStore', () => {
  // State
  const cardsByDeck = ref<Record<string, Card[]>>({});
  const lastDeletedCard = ref<{ card: Card; index: number } | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false); // only for fetchCards
  let undoTimeout: ReturnType<typeof setTimeout> | null = null;

  // Get cards for a deck
  function getCards(deckId: string): Card[] {
    return cardsByDeck.value[deckId] ?? [];
  }

  // Check if cards are already loaded for a deck
  function isCardsLoaded(deckId: string): boolean {
    return cardsByDeck.value[deckId] !== undefined;
  }

  // Fetch cards for a deck
  async function fetchCards(deckId: string) {
    isLoading.value = true;
    try {
      const response = await getCardsByDeck(deckId);
      cardsByDeck.value[deckId] = response.data;
    } catch {
      error.value = 'Failed to fetch cards.';
    } finally {
      isLoading.value = false;
    }
  }

  // Add a new card
  async function addCard(deckId: string, card: { question: string; answer: string }) {
    try {
      const response = await createCard(card, deckId);
      if (!cardsByDeck.value[deckId]) cardsByDeck.value[deckId] = [];
      cardsByDeck.value[deckId].unshift(response.data);
    } catch {
      error.value = 'Failed to add card.';
    }
  }

  // Edit a card
  async function editCard(
    deckId: string,
    cardId: string,
    updates: { question: string; answer: string }
  ) {
    try {
      const response = await updateCard(cardId, { ...updates, deckId });
      const cards = cardsByDeck.value[deckId];
      const idx = cards?.findIndex((c) => c.id === cardId);
      if (idx !== undefined && idx !== -1) cards[idx] = response.data;
    } catch {
      error.value = 'Failed to update card.';
    }
  }

  // Remove a card (optimistic, delay backend delete)
  function removeCard(deckId: string, cardId: string) {
    const cards = cardsByDeck.value[deckId];
    if (!cards) return;

    const index = cards.findIndex((c) => c.id === cardId);
    if (index === -1) return;

    const [card] = cards.splice(index, 1); // remove in place
    lastDeletedCard.value = { card, index };

    // Update deck cardCount immediately
    const deck = deckStore.decks.find((d) => d.id === deckId);
    if (deck) deck.cardCount = cards.length;

    // Cancel any existing timer
    if (undoTimeout) clearTimeout(undoTimeout);

    // Schedule backend delete if no undo in 5s
    undoTimeout = setTimeout(async () => {
      try {
        if (lastDeletedCard.value?.card.id === cardId) {
          await deleteCard(cardId); // backend delete only here
          lastDeletedCard.value = null;
        }
      } catch {
        error.value = 'Failed to delete card.';
      } finally {
        undoTimeout = null;
      }
    }, 5000);
  }

  // Undo last deleted card
  function undoDeleteCard(deckId: string) {
    if (!lastDeletedCard.value) return;

    const { card, index } = lastDeletedCard.value;

    if (!cardsByDeck.value[deckId]) cardsByDeck.value[deckId] = [];

    const cards = cardsByDeck.value[deckId];

    // Clamp index to valid range (in case list size changed)
    const safeIndex = Math.min(index, cards.length);

    cards.splice(safeIndex, 0, {
      ...card,
      dateUpdated: new Date().toISOString(),
    });

    // Clear undo state + cancel backend delete
    lastDeletedCard.value = null;
    if (undoTimeout) {
      clearTimeout(undoTimeout);
      undoTimeout = null;
    }
  }

  return {
    // State
    cardsByDeck,
    lastDeletedCard,
    error,
    isLoading,
    // Getters
    getCards,
    isCardsLoaded,

    // Actions
    fetchCards,
    addCard,
    editCard,
    removeCard,
    undoDeleteCard,
  };
});
