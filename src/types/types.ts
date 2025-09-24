export type Card = {
  id: string;
  question: string;
  answer: string;
  dateCreated: string;
  dateUpdated: string;
};

export type DeckSummary = {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  cardCount: number;
};

export type DeckDetail = {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  cards: Card[];
};
