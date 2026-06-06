<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchProjects } from '$lib/api/drips';
  import ProjectCard from '$lib/components/ProjectCard.svelte';

  let projects: any[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let search = $state('');

  const filtered = $derived(
    projects.filter(p =>
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
  );

  onMount(async () => {
    try {
      projects = await fetchProjects(24);
    } catch (e) {
      error = 'Could not load projects. The Drips API may be unavailable.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Explore Projects — DripsFlow</title>
</svelte:head>

<div class="page-header">
  <div>
    <h1 class="page-title">Explore projects</h1>
    <p class="page-sub">Web3 open-source projects actively funding contributors via Drips</p>
  </div>
  <input class="search" type="text" placeholder="Search projects..." bind:value={search} />
</div>

{#if loading}
  <div class="state-msg">
    <div class="spinner"></div>
    <span>Loading projects from Drips...</span>
  </div>
{:else if error}
  <div class="state-msg error">{error}</div>
{:else if filtered.length === 0}
  <div class="state-msg">No projects found{search ? ` for "${search}"` : ''}.</div>
{:else}
  <div class="projects-count">{filtered.length} projects</div>
  <div class="projects-grid">
    {#each filtered as project (project.id)}
      <ProjectCard {project} />
    {/each}
  </div>
{/if}

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  .page-title { font-size: 1.75rem; font-weight: 600; color: var(--color-heading); margin: 0 0 0.25rem; letter-spacing: -0.02em; }
  .page-sub { font-size: 0.875rem; color: var(--color-text-dim); margin: 0; }
  .search {
    padding: 0.5rem 1rem;
    background: var(--color-input-bg);
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    color: var(--color-text);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    width: 220px;
    outline: none;
    transition: border-color 0.15s;
  }
  .search:focus { border-color: var(--color-accent-border-focus); }
  .search::placeholder { color: var(--color-text-faint); }
  .projects-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--color-text-faint);
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  .state-msg {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 3rem 0;
    color: var(--color-text-dim);
    font-family: 'DM Mono', monospace;
    font-size: 0.875rem;
  }
  .state-msg.error { color: var(--color-error); }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--color-spinner-track);
    border-top-color: var(--color-spinner-head);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
