<script lang="ts">
  let { type = 'stream' }: { type?: 'stream' | 'project' } = $props();
</script>

<div class="skeleton-card" aria-hidden="true">
  <div class="skeleton-header">
    <div class="skeleton-avatar"></div>
    <div class="skeleton-stack">
      <div class="skeleton-line title"></div>
      <div class="skeleton-line small"></div>
    </div>
  </div>

  {#if type === 'stream'}
    <div class="skeleton-line amount"></div>
    <div class="skeleton-list">
      <div class="skeleton-row"></div>
      <div class="skeleton-row"></div>
      <div class="skeleton-row"></div>
    </div>
  {:else}
    <div class="skeleton-line description"></div>
    <div class="skeleton-line description short"></div>
    <div class="skeleton-footer">
      <div class="skeleton-line stat"></div>
      <div class="skeleton-pill"></div>
    </div>
  {/if}
</div>

<style>
  .skeleton-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    min-height: 184px;
  }

  .skeleton-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .skeleton-stack {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skeleton-avatar,
  .skeleton-line,
  .skeleton-pill,
  .skeleton-row {
    background: linear-gradient(90deg, rgba(125, 211, 252, 0.07), rgba(125, 211, 252, 0.16), rgba(125, 211, 252, 0.07));
    background-size: 220% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .skeleton-avatar {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .skeleton-line {
    height: 10px;
    border-radius: 999px;
  }

  .skeleton-line.title { width: 60%; }
  .skeleton-line.small { width: 38%; }
  .skeleton-line.amount { width: 52%; height: 24px; margin-top: 0.2rem; }
  .skeleton-line.description { width: 100%; }
  .skeleton-line.description.short { width: 72%; }
  .skeleton-line.stat { width: 42%; }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .skeleton-row {
    height: 9px;
    border-radius: 999px;
  }

  .skeleton-row:nth-child(1) { width: 92%; }
  .skeleton-row:nth-child(2) { width: 82%; }
  .skeleton-row:nth-child(3) { width: 88%; }

  .skeleton-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: auto;
  }

  .skeleton-pill {
    width: 96px;
    height: 20px;
    border-radius: 999px;
  }

  @keyframes shimmer {
    0% { background-position: 120% 0; }
    100% { background-position: -120% 0; }
  }
</style>
