import { computed, type Ref, ref } from 'vue';

export function useSearchFilter<T>(items: Ref<T[]>, fields: (keyof T)[]) {
  const query = ref('');

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim();
    const source = items.value ?? [];

    if (!q) return source;

    return source.filter((item) =>
      fields.some((field) => {
        const value = String(item[field] ?? '').toLowerCase();
        return value.includes(q);
      })
    );
  });

  return { query, filtered };
}
