<template>
  <main
    class="h-dvh flex items-center justify-center bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-white px-4"
    role="main"
  >
    <div class="w-full max-w-sm space-y-6">
      <!-- Heading -->
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white text-center">
        Ready to master what matters?
      </h1>

      <!-- Subheading -->
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
        Flippr helps you turn knowledge into confidence — one card at a time. Log in and start
        learning smarter.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
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
            autocomplete="current-password"
            class="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ error }}
        </p>

        <!-- Submit -->
        <BaseButton
          :label="loading ? 'Logging in…' : 'Log In'"
          variant="primary"
          :disabled="loading"
          type="submit"
          class="w-full"
          aria-label="Log in to Flippr"
          @click="handleLogin"
        />
      </form>
      <!-- <hr class="border-t border-gray-200 dark:border-gray-700" /> -->

      <p class="text-sm text-center text-gray-600 dark:text-gray-400">
        New to Flippr?
        <RouterLink
          to="/register"
          class="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create an account.
        </RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import BaseButton from '@/components/BaseButton.vue';

import { onMounted } from 'vue';

const { username, password, error, loading, login: handleLogin } = useAuth();

onMounted(() => {
  if (localStorage.getItem('token')) {
    window.location.href = '/dashboard';
  }
});
</script>
