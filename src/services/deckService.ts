import api from '@/utils/http';
import type { DeckSummary, DeckDetail } from '@/types/types';

export const getDecks = (skip = 0, limit = 12) => {
  return api.get<{ decks: DeckSummary[]; hasMore: boolean }>(`/decks?skip=${skip}&limit=${limit}`);
};
export const createDeck = (deck: { title: string }) => api.post<DeckSummary>('/decks', deck);

export const updateDeck = (id: string, deck: Partial<DeckSummary>) =>
  api.put<DeckSummary>(`/decks/${id}`, deck);

export const deleteDeck = (id: string) => api.delete(`/decks/${id}`);

export function getDeckWithCards(deckId: string) {
  return api.get<DeckDetail>(`/decks/${deckId}/cards`);
}
