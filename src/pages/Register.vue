<template>
  <main
    class="h-dvh flex items-center justify-center bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-white px-4"
    role="main"
  >
    <div class="w-full max-w-sm space-y-6">
      <!-- Heading -->
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white text-center">
        Create your Flippr account
      </h1>

      <!-- Subheading -->
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
        Start learning smarter with flashcards that stick. It only takes a minute to sign up.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium mb-1"> Username </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium mb-1"> Password </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ error }}
        </p>

        <!-- Submit -->
        <BaseButton
          :label="loading ? 'Creating account…' : 'Sign Up'"
          variant="primary"
          :disabled="loading"
          type="submit"
          class="w-full"
          aria-label="Create Flippr account"
          @click="handleRegister"
        />
      </form>

      <!-- Login Link -->
      <p class="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?
        <RouterLink
          to="/login"
          class="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Log in
        </RouterLink>
      </p>
    </div>
  </main>
</template>
<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import { useAuth } from '@/composables/useAuth';
import { ref } from 'vue';

const confirmPassword = ref('');
const { username, password, error, loading, register } = useAuth();

function handleRegister() {
  register(confirmPassword.value);
}
</script>
