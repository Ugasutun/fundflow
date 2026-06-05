<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchProjects } from '$lib/api/drips';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import Skeleton from '$lib/components/Skeleton.svelte';

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
  <div class="projects-count">Loading projects</div>
  <div class="projects-grid" aria-label="Loading projects">
    {#each Array(6) as _, index (index)}
      <Skeleton type="project" />
    {/each}
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
  .page-title { font-size: 1.75rem; font-weight: 600; color: #f1f5f9; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
  .page-sub { font-size: 0.875rem; color: #475569; margin: 0; }
  .search {
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    width: 220px;
    outline: none;
    transition: border-color 0.15s;
  }
  .search:focus { border-color: rgba(125,211,252,0.3); }
  .search::placeholder { color: #334155; }
  .projects-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #334155;
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
    color: #475569;
    font-family: 'DM Mono', monospace;
    font-size: 0.875rem;
  }
  .state-msg.error { color: #f87171; }
</style>
