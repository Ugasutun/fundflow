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
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .project-card:hover { border-color: rgba(125,211,252,0.2); background: rgba(255,255,255,0.05); }
  .project-header { display: flex; align-items: center; gap: 0.75rem; }
  .project-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(125,211,252,0.1); border: 1px solid rgba(125,211,252,0.2);
    color: #7dd3fc; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 1rem; font-weight: 600; flex-shrink: 0;
  }
  .project-name { margin: 0 0 2px; font-size: 0.95rem; font-weight: 500; color: #e2e8f0; }
  .project-domain { font-size: 0.75rem; color: #475569; text-decoration: none; font-family: 'DM Mono', monospace; }
  .project-domain:hover { color: #7dd3fc; }
  .project-desc {
    margin: 0; font-size: 0.8rem; color: #64748b; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .project-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
  .stat { display: flex; align-items: baseline; gap: 4px; }
  .stat-val { font-size: 1rem; font-weight: 600; color: #f1f5f9; font-family: 'DM Mono', monospace; }
  .stat-label { font-size: 0.7rem; color: #475569; }
  .funded-badge {
    font-size: 0.7rem; padding: 2px 8px; border-radius: 20px;
    background: rgba(125,211,252,0.07); color: #38bdf8;
    border: 1px solid rgba(125,211,252,0.15); font-family: 'DM Mono', monospace;
  }
</style>
