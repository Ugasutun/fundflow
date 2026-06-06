<script lang="ts">
  let { project }: {
    project: {
      id: string;
      name: string;
      description?: string;
      url?: string;
      splits?: { items: { receiver: { address?: string }; weight: number }[] };
    };
  } = $props();

  const contributorCount = $derived(project.splits?.items?.length ?? 0);
  const domain = $derived(project.url ? (() => { try { return new URL(project.url!).hostname.replace('www.', ''); } catch { return null; } })() : null);
</script>

<div class="project-card">
  <div class="project-header">
    <div class="project-icon">{project.name?.[0]?.toUpperCase() ?? '?'}</div>
    <div>
      <p class="project-name">{project.name ?? 'Unnamed project'}</p>
      {#if domain}
        <a href={project.url} target="_blank" rel="noopener" class="project-domain">{domain} ↗</a>
      {/if}
    </div>
  </div>
  {#if project.description}
    <p class="project-desc">{project.description}</p>
  {/if}
  <div class="project-footer">
    <div class="stat">
      <span class="stat-val">{contributorCount}</span>
      <span class="stat-label">contributors</span>
    </div>
    <span class="funded-badge">Funded via Drips</span>
  </div>
</div>

<style>
  .project-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border-strong);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .project-card:hover { border-color: var(--color-accent-border-card); background: var(--color-card-bg-hover); }
  .project-header { display: flex; align-items: center; gap: 0.75rem; }
  .project-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--color-accent-bg-strong); border: 1px solid var(--color-accent-border);
    color: var(--color-accent); display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 1rem; font-weight: 600; flex-shrink: 0;
  }
  .project-name { margin: 0 0 2px; font-size: 0.95rem; font-weight: 500; color: var(--color-text); }
  .project-domain { font-size: 0.75rem; color: var(--color-text-dim); text-decoration: none; font-family: 'DM Mono', monospace; }
  .project-domain:hover { color: var(--color-accent); }
  .project-desc {
    margin: 0; font-size: 0.8rem; color: var(--color-text-subtle); line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .project-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
  .stat { display: flex; align-items: baseline; gap: 4px; }
  .stat-val { font-size: 1rem; font-weight: 600; color: var(--color-heading); font-family: 'DM Mono', monospace; }
  .stat-label { font-size: 0.7rem; color: var(--color-text-dim); }
  .funded-badge {
    font-size: 0.7rem; padding: 2px 8px; border-radius: 20px;
    background: var(--color-accent-bg-subtle); color: var(--color-accent-hover);
    border: 1px solid var(--color-accent-border-faint); font-family: 'DM Mono', monospace;
  }
</style>
