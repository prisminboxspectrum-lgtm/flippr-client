import type { Deck } from '@/types/types';
import api from '@/utils/http';

export function getDeck(deckId: string) {
  return api.get<Deck>(`/decks/${deckId}`);
}

export const getDecks = (skip = 0, limit = 12) => {
  return api.get<{ decks: Deck[]; hasMore: boolean }>(`/decks?skip=${skip}&limit=${limit}`);
};

export const createDeck = (deck: { title: string }) => api.post<Deck>('/decks', deck);

export const updateDeck = (id: string, deck: Partial<Deck>) => api.put<Deck>(`/decks/${id}`, deck);

export const deleteDeck = (id: string) => api.delete(`/decks/${id}`);
