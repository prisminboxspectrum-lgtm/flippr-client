import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useToast } from '@/composables/useToast';
import { useDeckStore } from '@/stores/deckStore';
import type { Deck } from '@/types/types';

export function useDeckManagement(deckId: string) {
  const deckStore = useDeckStore();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const deck = computed<Deck | null>(() => deckStore.decks.find((d) => d.id === deckId) ?? null);
  const isDeleteOpen = ref(false);

  // Update deck title
  async function updateTitle(newTitle: string) {
    if (!deck.value) return;
    try {
      await deckStore.updateDeck({ ...deck.value, title: newTitle });
      deck.value.title = newTitle;
      deck.value.dateUpdated = new Date().toISOString();
      success(`Deck renamed to "${newTitle}"`);
    } catch {
      showError('Failed to update deck title.');
    }
  }

  // Delete deck
  async function deleteDeck() {
    if (!deck.value) return;
    const title = deck.value.title;
    try {
      await deckStore.deleteDeck(deckId);
      success(`Deck "${title}" deleted successfully!`);
      router.push('/dashboard');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to delete deck.');
    } finally {
      isDeleteOpen.value = false;
    }
  }

  return { deck, isDeleteOpen, updateTitle, deleteDeck };
}
