export type Card = {
  id: string;
  deckId: string;
  userId: string;
  question: string;
  answer: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Deck = {
  id: string;
  userId: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  cardCount: number;
};

/**
 * @deprecated
 * Only use temporarily in ManagePage.
 * Replace with Deck + Card[] as soon as possible.
 */
export type DeckDetail = Deck & {
  cards: Card[];
};
