import { ref } from 'vue';

import {
  createDeck,
  deleteDeck as deleteDeckRequest,
  getDecks,
  getDeckWithCards,
  updateDeck as updateDeckRequest,
} from '@/services/deckService';
import type { DeckDetail, DeckSummary } from '@/types/types';

export const decks = ref<DeckSummary[]>([]);
export const ready = ref(false);
export const hasMore = ref(true);

function toSummary(deck: DeckDetail): DeckSummary {
  return {
    id: deck.id,
    title: deck.title,
    dateCreated: deck.dateCreated,
    dateUpdated: deck.dateUpdated,
    cardCount: deck.cards.length,
  };
}

// Load decks in batches
export async function loadDecksBatch(offset = 0, limit = 12) {
  try {
    const response = await getDecks(offset, limit);
    const { decks: newDecks, hasMore: more } = response.data;

    hasMore.value = more;
    decks.value.push(...newDecks);
    ready.value = true;
  } catch (err) {
    console.error('Failed to load decks:', err);
  }
}

// Add a new deck
export async function addDeck(deck: { title: string }) {
  try {
    const response = await createDeck(deck);
    decks.value.unshift(response.data);
    return response.data;
  } catch (err) {
    console.error('Failed to create deck:', err);
    throw err;
  }
}

// Update deck metadata
export async function updateDeck(updated: DeckSummary | DeckDetail) {
  const summary = 'cards' in updated ? toSummary(updated) : updated;
  try {
    const response = await updateDeckRequest(summary.id, summary);
    const idx = decks.value.findIndex((d) => d.id === summary.id);
    if (idx !== -1) decks.value[idx] = response.data;
  } catch (err) {
    console.error('Failed to update deck:', err);
  }
}

// Delete a deck
export async function deleteDeck(id: string) {
  try {
    await deleteDeckRequest(id);
    decks.value = decks.value.filter((d) => d.id !== id);
  } catch (err) {
    console.error('Failed to delete deck:', err);
  }
}

// Fetch a single deck with its cards
export async function fetchDeckWithCards(deckId: string): Promise<DeckDetail> {
  try {
    const response = await getDeckWithCards(deckId);
    const deckDetail: DeckDetail = response.data;
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
