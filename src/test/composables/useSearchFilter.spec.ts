import { beforeEach, describe, expect, it } from 'vitest';
import { type Ref, ref } from 'vue';

import { useSearchFilter } from '@/composables/useSearchFilter';
import type { Card, Deck } from '@/types/types';

describe('useSearchFilter composable', () => {
  describe('Deck filtering', () => {
    let decks: Ref<Deck[]>;

    beforeEach(() => {
      decks = ref([
        {
          id: '1',
          userId: 'u1',
          title: 'Frontend Developer Topics',
          dateCreated: '',
          dateUpdated: '',
          cardCount: 5,
        },
        {
          id: '2',
          userId: 'u2',
          title: 'Backend Developer Topics',
          dateCreated: '',
          dateUpdated: '',
          cardCount: 3,
        },
      ]);
    });

    it('filters decks by title', () => {
      const { query, filtered } = useSearchFilter(decks, ['title']);
      query.value = 'frontend';
      expect(filtered.value).toEqual([decks.value[0]]);
    });

    it('returns all decks if query is empty', () => {
      const { filtered } = useSearchFilter(decks, ['title']);
      expect(filtered.value).toEqual(decks.value);
    });

    it('returns empty array if no decks match', () => {
      const { query, filtered } = useSearchFilter(decks, ['title']);
      query.value = 'Non-existent Deck';
      expect(filtered.value).toEqual([]);
    });
  });

  describe('Card filtering', () => {
    let cards: Ref<Card[]>;

    beforeEach(() => {
      cards = ref([
        {
          id: '1',
          deckId: '1',
          userId: 'u1',
          question: 'What is Vue 3?',
          answer: 'A progressive JS framework',
          dateCreated: '',
          dateUpdated: '',
        },
        {
          id: '2',
          deckId: '1',
          userId: 'u1',
          question: 'What is React?',
          answer: 'Another JS library',
          dateCreated: '',
          dateUpdated: '',
        },
      ]);
    });

    it('filters cards by question', () => {
      const { query, filtered } = useSearchFilter(cards, ['question']);
      query.value = 'vue';
      expect(filtered.value).toEqual([cards.value[0]]);
    });

    it('returns all cards if query is empty', () => {
      const { filtered } = useSearchFilter(cards, ['question']);
      expect(filtered.value).toEqual(cards.value);
    });

    it('returns empty array if no cards match', () => {
      const { query, filtered } = useSearchFilter(cards, ['question']);
      query.value = 'Angular';
      expect(filtered.value).toEqual([]);
    });
  });
});
