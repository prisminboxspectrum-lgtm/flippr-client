import { ref } from 'vue';

import { createCard, deleteCard, getCardsByDeck, updateCard } from '@/services/cardService';
import type { Card, DeckDetail } from '@/types/types';

export function useCards(deckId: string) {
  const cards = ref<Card[]>([]);
  const lastDeletedCard = ref<Card | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let undoTimeout: ReturnType<typeof setTimeout> | null = null;

  // Fetch cards for the deck
  async function fetchCards() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getCardsByDeck(deckId); // returns DeckDetail
      const deckDetail: DeckDetail = response.data;
      console.log('DeckDetail from API:', deckDetail);
      cards.value = deckDetail.cards; // ✅ assign the cards array
      console.log('Cards array:', cards.value);
    } catch {
      error.value = 'Failed to load cards. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }

  // Add a new card
  async function addCard(card: { question: string; answer: string }) {
    try {
      const response = await createCard(card, deckId);
      cards.value.push(response.data);
    } catch {
      error.value = 'Failed to add card.';
    }
  }

  // Edit an existing card
  async function editCard(cardId: string, updates: { question: string; answer: string }) {
    try {
      const response = await updateCard(cardId, { ...updates, deckId });
      const idx = cards.value.findIndex((c) => c.id === cardId);
      if (idx !== -1) cards.value[idx] = response.data;
    } catch {
      error.value = 'Failed to update card.';
    }
  }

  // Remove a card with undo support
  async function removeCard(cardId: string) {
    const card = cards.value.find((c) => c.id === cardId);
    if (!card) return;

    try {
      await deleteCard(cardId);
      cards.value = cards.value.filter((c) => c.id !== cardId);
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

  // Undo last deletion
  function undoDeleteCard() {
    if (!lastDeletedCard.value) return;

    cards.value.push({
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
    cards,
    isLoading,
    error,
    addCard,
    editCard,
    removeCard,
    undoDeleteCard,
    lastDeletedCard,
    fetchCards,
  };
}
