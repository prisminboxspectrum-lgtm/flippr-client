import { defineStore } from 'pinia';
import { ref } from 'vue';

import { createCard, deleteCard, getCardsByDeck, updateCard } from '@/services/cardService';
import type { Card, DeckDetail } from '@/types/types';

export const useCardStore = defineStore('cardStore', () => {
  const cardsByDeck = ref<Record<string, Card[]>>({});
  const lastDeletedCard = ref<Card | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let undoTimeout: ReturnType<typeof setTimeout> | null = null;

  function getCards(deckId: string): Card[] {
    return cardsByDeck.value[deckId] ?? [];
  }

  async function fetchCards(deckId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getCardsByDeck(deckId);
      const deckDetail: DeckDetail = response.data;
      cardsByDeck.value[deckId] = deckDetail.cards;
    } catch {
      error.value = 'Failed to load cards. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  async function addCard(deckId: string, card: { question: string; answer: string }) {
    try {
      const response = await createCard(card, deckId);
      if (!cardsByDeck.value[deckId]) cardsByDeck.value[deckId] = [];
      cardsByDeck.value[deckId].unshift(response.data);
    } catch {
      error.value = 'Failed to add card.';
    }
  }

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

  async function removeCard(deckId: string, cardId: string) {
    const cards = cardsByDeck.value[deckId];
    const card = cards?.find((c) => c.id === cardId);
    if (!card) return;

    try {
      await deleteCard(cardId);
      cardsByDeck.value[deckId] = cards.filter((c) => c.id !== cardId);
      lastDeletedCard.value = { ...card };

      if (undoTimeout) clearTimeout(undoTimeout);
      undoTimeout = setTimeout(() => {
        lastDeletedCard.value = null;
        undoTimeout = null;
      }, 5000);
    } catch {
      error.value = 'Failed to delete card.';
    }
  }

  function undoDeleteCard(deckId: string) {
    if (!lastDeletedCard.value) return;

    if (!cardsByDeck.value[deckId]) cardsByDeck.value[deckId] = [];
    cardsByDeck.value[deckId].push({
      ...lastDeletedCard.value,
      dateUpdated: new Date().toISOString(),
    });

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
    isLoading,
    error,

    // Getters
    getCards,

    // Actions
    fetchCards,
    addCard,
    editCard,
    removeCard,
    undoDeleteCard,
  };
});
