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
