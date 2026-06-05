<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
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
    background: #060810;
    color: #e2e8f0;
    font-family: 'Syne', sans-serif;
    margin: 0;
    min-height: 100vh;
  }
  :global(*) { box-sizing: border-box; }
  .app-shell { min-height: 100vh; }
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
</style>
