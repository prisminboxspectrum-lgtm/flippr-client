import { computed, type Ref, ref } from 'vue';

export function useSearchFilter<T>(items: Ref<T[]>, fields: (keyof T)[]) {
  const query = ref('');

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim();
    if (!q) return items.value;

    return items.value.filter((item) =>
      fields.some((field) => {
        const value = String(item[field] ?? '').toLowerCase();
        return value.includes(q);
      })
    );
  });

  return { query, filtered };
}
