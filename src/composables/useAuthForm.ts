// composables/useAuthForm.ts
import { onMounted, Ref, watch } from 'vue';

import type { useAuthStore } from '@/stores/authStore';

/**
 * Handles automatic clearing of authentication errors when a form is mounted
 * and when any of the input fields change.
 *
 * @param authStore - Pinia auth store instance
 * @param fields - Array of refs representing form fields
 */
export function useAuthForm(authStore: ReturnType<typeof useAuthStore>, fields: Ref<string>[]) {
  // Clear errors when the form is first mounted
  onMounted(() => {
    authStore.clearError();
  });

  // Clear errors whenever user types in any of the fields
  watch(fields, () => {
    authStore.clearError();
  });
}
