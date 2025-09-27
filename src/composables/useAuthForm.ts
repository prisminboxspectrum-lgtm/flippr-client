import { onMounted, Ref, watch } from 'vue';

import type { useAuthStore } from '@/stores/authStore';

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
