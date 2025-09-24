import { onMounted, ref } from 'vue';

const isDark = ref(false);

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }

  function init() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      isDark.value = true;
      document.documentElement.classList.add('dark');
    }
  }

  onMounted(init);

  return { isDark, toggle };
}
