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
      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium mb-1"> Username </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="form-control border border-gray-300 dark:border-gray-600"
            aria-label="Username"
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
            class="form-control border border-gray-300 dark:border-gray-600"
            aria-label="Password"
          />
        </div>
        <!-- Error Message -->
        <p v-if="authStore.error" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ authStore.error }}
        </p>
        <!-- Submit -->
        <BaseButton
          :label="authStore.loading ? 'Logging in…' : 'Log In'"
          variant="primary"
          :disabled="authStore.loading"
          type="submit"
          class="w-full"
          aria-label="Log in to Flippr"
        />
      </form>
      <p class="text-sm text-center text-gray-600 dark:text-gray-400">
        New to Flippr?
        <RouterLink
          to="/register"
          class="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create an account
        </RouterLink>
      </p>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Form state
const username = ref('');
const password = ref('');

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard');
  }
});

async function handleLogin() {
  const result = await authStore.login(username.value, password.value);

  if (result.success) {
    router.push('/dashboard');
  }
}
</script>
