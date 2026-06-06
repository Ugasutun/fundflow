<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import '$lib/stores/theme';

  let { children } = $props();
</script>

<div class="app-shell">
  <Navbar />
  <main>
    {@render children()}
  </main>
</div>

<style>
  :global(body) {
    background: var(--color-surface);
    color: var(--color-text);
    font-family: 'Syne', sans-serif;
    margin: 0;
    min-height: 100vh;
    transition: background 0.2s ease, color 0.2s ease;
  }
  :global(*) { box-sizing: border-box; }
  .app-shell { min-height: 100vh; }
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
</style>
