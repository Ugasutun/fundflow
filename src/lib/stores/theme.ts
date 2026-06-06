import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

function loadTheme(): Theme {
  if (!browser) return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const initial = loadTheme();
export const theme = writable<Theme>(initial);

if (browser) {
  document.documentElement.dataset.theme = initial;
  theme.subscribe((value) => {
    document.documentElement.dataset.theme = value;
    localStorage.setItem('theme', value);
  });
}
