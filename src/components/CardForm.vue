<template>
  <div class="space-y-4" role="group" aria-label="Card form">
    <!-- Question -->
    <div>
      <label for="question" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Question <span class="text-red-600">*</span>
      </label>
      <input
        id="question"
        v-model="card.question"
        type="text"
        maxlength="250"
        required
        aria-required="true"
        aria-label="Card question"
        class="form-control mt-1"
        placeholder="e.g. What is a cell?"
      />
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ card.question.length }}/250 characters
      </p>
    </div>

    <!-- Answer -->
    <div>
      <label for="answer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Answer <span class="text-red-600">*</span>
      </label>
      <textarea
        id="answer"
        v-model="card.answer"
        rows="3"
        maxlength="500"
        required
        aria-required="true"
        aria-label="Card answer"
        class="form-control mt-1"
        placeholder="e.g. The basic unit of life."
      ></textarea>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ card.answer.length }}/500 characters
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Card {
  question: string;
  answer: string;
}

const props = defineProps<{
  modelValue: Card;
}>();

const emit = defineEmits(['update:modelValue']);

const card = computed({
  get: () => props.modelValue,
  set: (value: Card) => emit('update:modelValue', value),
});
</script>
