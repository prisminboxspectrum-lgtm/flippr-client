import { computed } from 'vue';

import { useCardStore } from '@/stores/cardStore';
import { useDeckStore } from '@/stores/deckStore';
import type { Deck } from '@/types/types';

export function useFetchDeckAndCards(deckId: string) {
  const cardStore = useCardStore();
  const deckStore = useDeckStore();

  const deck = computed<Deck | null>(() => deckStore.decks.find((d) => d.id === deckId) ?? null);
  const cards = computed(() => cardStore.getCards(deckId));

  const showDeckSkeleton = computed(() => deckStore.loading || !deck.value);
  const showCardSkeleton = computed(
    () => cardStore.isLoading && (!deck.value || (deck.value.cardCount ?? 0) > 0)
  );

  async function fetchDeckAndCards() {
    try {
      if (!deck.value) deckStore.loading = true;
      if (!cardStore.isCardsLoaded(deckId)) cardStore.isLoading = true;

      await Promise.all([
        deck.value ? null : deckStore.fetchDeck(deckId),
        cardStore.isCardsLoaded(deckId) ? null : cardStore.fetchCards(deckId),
      ]);
    } finally {
      deckStore.loading = false;
      cardStore.isLoading = false;
    }
  }

  return {
    deck,
    cards,
    showDeckSkeleton,
    showCardSkeleton,
    fetchDeckAndCards,
  };
}
