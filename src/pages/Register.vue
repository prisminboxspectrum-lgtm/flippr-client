<template>
  <main
    class="h-dvh flex items-center justify-center bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-white px-4"
    role="main"
  >
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white text-center">
        Create your Flippr account
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
        Start learning smarter with flashcards that stick. It only takes a minute to sign up.
      </p>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium mb-1">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="form-control border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium mb-1">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="form-control border border-gray-300 dark:border-gray-600 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
              @click="togglePassword"
              :aria-pressed="showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <component
                :is="showPassword ? EyeSlashIcon : EyeIcon"
                class="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>

          <!-- Password Strength & Validation (single line) -->
          <div v-if="password.length > 0" class="mt-2">
            <div class="h-2 w-full rounded bg-gray-300 dark:bg-gray-700">
              <div
                class="h-2 rounded transition-all duration-300"
                :class="{
                  'bg-red-600 w-1/3': strengthScore < 2,
                  'bg-yellow-500 w-2/3': strengthScore >= 2 && strengthScore < 4,
                  'bg-green-600 w-full': strengthScore >= 4,
                }"
              ></div>
            </div>
            <p
              class="text-xs mt-1"
              :class="
                isPasswordValid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ passwordMessage }}
            </p>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium mb-1"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="form-control border border-gray-300 dark:border-gray-600 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
              @click="toggleConfirmPassword"
              :aria-pressed="showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
            >
              <component
                :is="showConfirmPassword ? EyeSlashIcon : EyeIcon"
                class="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
          <p
            v-if="confirmPassword.length > 0 && password !== confirmPassword"
            class="text-sm text-red-600 dark:text-red-400 mt-1"
          >
            Passwords do not match
          </p>
        </div>

        <!-- Error Message -->
        <p v-if="authStore.error" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ authStore.error }}
        </p>

        <!-- Submit -->
        <BaseButton
          :label="authStore.loading ? 'Creating account…' : 'Sign Up'"
          variant="primary"
          :disabled="authStore.loading || !isPasswordValid || password !== confirmPassword"
          type="submit"
          class="w-full"
          aria-label="Create Flippr account"
        />
      </form>

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
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseButton from '@/components/BaseButton.vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

// Password rules
const passwordRules = computed(() => ({
  minLength: password.value.length >= MIN_PASSWORD_LENGTH,
  maxLength: password.value.length <= MAX_PASSWORD_LENGTH,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /[0-9]/.test(password.value),
  specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
}));

const isPasswordValid = computed(() => Object.values(passwordRules.value).every(Boolean));

const strengthScore = computed(() => {
  let score = 0;
  if (passwordRules.value.minLength) score++;
  if (passwordRules.value.uppercase) score++;
  if (passwordRules.value.lowercase) score++;
  if (passwordRules.value.number) score++;
  if (passwordRules.value.specialChar) score++;
  return score;
});

// Single-line validation message
const passwordMessage = computed(() => {
  if (password.value.length === 0) return '';
  if (!passwordRules.value.minLength) return `At least ${MIN_PASSWORD_LENGTH} characters`;
  if (!passwordRules.value.maxLength) return `No more than ${MAX_PASSWORD_LENGTH} characters`;
  if (!passwordRules.value.uppercase) return 'Add at least one uppercase letter';
  if (!passwordRules.value.lowercase) return 'Add at least one lowercase letter';
  if (!passwordRules.value.number) return 'Add at least one number';
  if (!passwordRules.value.specialChar) return 'Add at least one special character';
  return 'Strong password!';
});

// Methods
async function handleRegister() {
  const result = await authStore.register(username.value, password.value, confirmPassword.value);
  if (result.success) router.push('/dashboard');
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}
function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}
</script>
