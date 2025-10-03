import type { Card } from '@/types/types';
import api from '@/utils/http';

export const getCardsByDeck = (deckId: string) => api.get<Card[]>(`/decks/${deckId}/cards`);

export const createCard = (data: { question: string; answer: string }, deckId: string) =>
  api.post<Card>('/cards', { ...data, deckId });

export const updateCard = (
  cardId: string,
  data: { question: string; answer: string; deckId: string }
) => api.put<Card>(`/cards/${cardId}`, data);

export const deleteCard = (cardId: string) => api.delete<void>(`/cards/${cardId}`);
