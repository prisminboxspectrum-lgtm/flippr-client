import type { DeckDetail } from '@/types/types';
import api from '@/utils/http';

export const getCards = () => api.get('/cards');

export const createCard = (data: { question: string; answer: string }, deckId: string) =>
  api.post('/cards', { ...data, deckId });

export const updateCard = (
  cardId: string,
  data: { question: string; answer: string; deckId: string }
) => api.put(`/cards/${cardId}`, data);

export const deleteCard = (cardId: string) => api.delete(`/cards/${cardId}`);

export const getCardsByDeck = (deckId: string) => api.get<DeckDetail>(`/decks/${deckId}/cards`);
