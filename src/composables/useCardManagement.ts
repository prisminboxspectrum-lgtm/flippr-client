import { ref } from 'vue';

import { useCardStore } from '@/stores/cardStore';
import type { Card } from '@/types/types';

import { useToast } from './useToast';

export function useCardManagement(deckId: string) {
  const cardStore = useCardStore();
  const { success, error: showError } = useToast();

  // Modals
  const isAddCardOpen = ref(false);
  const isEditCardOpen = ref(false);

  // Card state
  const newCard = ref({ question: '', answer: '' });
  const blankCard: Card = {
    id: '',
    deckId: '',
    userId: '',
    question: '',
    answer: '',
    dateCreated: '',
    dateUpdated: '',
  };
  const editedCard = ref<Card>({ ...blankCard });

  // Modals helpers
  function closeAddCardModal() {
    isAddCardOpen.value = false;
    newCard.value = { question: '', answer: '' };
  }

  function openEditCard(card: Card) {
    if (!card.id) return;
    editedCard.value = { ...card };
    isEditCardOpen.value = true;
  }

  function closeEditCardModal() {
    isEditCardOpen.value = false;
    editedCard.value = { ...blankCard };
  }

  // Card actions
  async function handleAddCard() {
    const q = newCard.value.question.trim();
    const a = newCard.value.answer.trim();
    if (!q || !a) return;

    try {
      await cardStore.addCard(deckId, { question: q, answer: a });
      success(`Card "${q}" added successfully!`);
    } catch {
      showError('Failed to add card.');
    } finally {
      closeAddCardModal();
    }
  }

  async function saveEditedCard() {
    const q = editedCard.value.question.trim();
    const a = editedCard.value.answer.trim();
    if (!editedCard.value.id || !q || !a) return showError('Cannot update card');

    try {
      await cardStore.editCard(deckId, editedCard.value.id, { question: q, answer: a });
      success(`Card "${q}" updated successfully!`);
    } catch {
      showError('Failed to update card.');
    } finally {
      closeEditCardModal();
    }
  }

  async function deleteCard(card: Card) {
    try {
      await cardStore.removeCard(deckId, card.id);
      success({
        message: `Card "${card.question}" deleted.`,
        action: {
          label: 'UNDO',
          onClick: () => cardStore.undoDeleteCard(deckId),
        },
      });
    } catch {
      showError('Failed to delete card.');
    }
  }

  return {
    isAddCardOpen,
    isEditCardOpen,
    newCard,
    editedCard,
    blankCard,
    handleAddCard,
    saveEditedCard,
    deleteCard,
    closeAddCardModal,
    openEditCard,
    closeEditCardModal,
  };
}
