<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { fetchStreams } from '$lib/api/drips';
  import { fetchGithubUser, fetchGithubRepos } from '$lib/api/github';
  import Skeleton from '$lib/components/Skeleton.svelte';
  import StreamCard from '$lib/components/StreamCard.svelte';

  const address = $derived(page.params.address);
  const shortAddr = $derived(address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '');

  let streams: any = $state(null);
  let githubUser: any = $state(null);
  let repos: any[] = $state([]);
  let loading = $state(true);
  let githubInput = $state('');
  let showGithubInput = $state(false);

  onMount(async () => {
    if (!address) {
      loading = false;
      return;
    }

    streams = await fetchStreams(address);
    loading = false;
  });

  async function linkGithub() {
    if (!githubInput.trim()) return;
    const username = githubInput.trim().replace('@', '');
    const [user, userRepos] = await Promise.all([
      fetchGithubUser(username),
      fetchGithubRepos(username),
    ]);
    githubUser = user;
    repos = userRepos;
    showGithubInput = false;
    githubInput = '';
  }

  const incomingStreams = $derived(streams?.incomingStreams ?? []);
  const outgoingStreams = $derived(streams?.outgoingStreams ?? []);
</script>

<svelte:head>
  <title>Profile {shortAddr} — DripsFlow</title>
</svelte:head>

<div class="profile-header">
  <div class="avatar">
    {#if githubUser?.avatar_url}
      <img src={githubUser.avatar_url} alt={githubUser.login} class="avatar-img" />
    {:else}
      <span class="avatar-placeholder">◈</span>
    {/if}
  </div>
  <div class="profile-info">
    {#if githubUser}
      <h1 class="profile-name">{githubUser.name ?? githubUser.login}</h1>
      <p class="profile-handle">@{githubUser.login} · <span class="addr-mono">{shortAddr}</span></p>
      {#if githubUser.bio}<p class="profile-bio">{githubUser.bio}</p>{/if}
    {:else}
      <h1 class="profile-name addr-mono">{shortAddr}</h1>
      <button class="link-github-btn" onclick={() => (showGithubInput = true)}>
        + Link GitHub identity
      </button>
    {/if}
  </div>
</div>

{#if showGithubInput}
  <div class="github-input-row">
    <input
      class="github-input"
      type="text"
      placeholder="GitHub username"
      bind:value={githubInput}
      onkeydown={(e) => e.key === 'Enter' && linkGithub()}
    />
    <button class="btn-confirm" onclick={linkGithub}>Link</button>
    <button class="btn-cancel" onclick={() => (showGithubInput = false)}>Cancel</button>
  </div>
{/if}

{#if loading}
  <div class="sections" aria-label="Loading profile streams">
    <section>
      <h2 class="section-title">Incoming streams</h2>
      <div class="streams-grid">
        {#each Array(3) as _, index (index)}
          <Skeleton type="stream" />
        {/each}
      </div>
    </section>

    <section>
      <h2 class="section-title">Outgoing streams</h2>
      <div class="streams-grid">
        {#each Array(3) as _, index (index)}
          <Skeleton type="stream" />
        {/each}
      </div>
    </section>
  </div>
{:else}
  <div class="sections">
    <section>
      <h2 class="section-title">
        Incoming streams
        <span class="count-badge">{incomingStreams.length}</span>
      </h2>
      {#if incomingStreams.length === 0}
        <p class="empty">No incoming streams found for this address.</p>
      {:else}
        <div class="streams-grid">
          {#each incomingStreams as stream (stream.id)}
            <StreamCard {stream} direction="incoming" />
          {/each}
        </div>
      {/if}
    </section>

    <section>
      <h2 class="section-title">
        Outgoing streams
        <span class="count-badge">{outgoingStreams.length}</span>
      </h2>
      {#if outgoingStreams.length === 0}
        <p class="empty">No outgoing streams found for this address.</p>
      {:else}
        <div class="streams-grid">
          {#each outgoingStreams as stream (stream.id)}
            <StreamCard {stream} direction="outgoing" />
          {/each}
        </div>
      {/if}
    </section>

    {#if repos.length > 0}
      <section>
        <h2 class="section-title">GitHub repositories</h2>
        <div class="repos-grid">
          {#each repos as repo (repo.id)}
            <a href={repo.html_url} target="_blank" rel="noopener" class="repo-card">
              <p class="repo-name">{repo.name}</p>
              {#if repo.description}<p class="repo-desc">{repo.description}</p>{/if}
              <div class="repo-meta">
                {#if repo.language}<span class="repo-tag">{repo.language}</span>{/if}
                <span class="repo-tag">★ {repo.stargazers_count}</span>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/if}
  </div>
{/if}

<style>
  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(125, 211, 252, 0.1);
    border: 1px solid rgba(125, 211, 252, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .avatar-img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-placeholder { font-size: 1.5rem; color: #7dd3fc; }

  .profile-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
  }

  .profile-handle {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: #475569;
    margin: 0 0 0.5rem;
  }

  .profile-bio { font-size: 0.875rem; color: #64748b; margin: 0; }
  .addr-mono { font-family: 'DM Mono', monospace; }

  .link-github-btn {
    background: none;
    border: 1px dashed rgba(125, 211, 252, 0.3);
    color: #475569;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 0.25rem;
  }

  .link-github-btn:hover { color: #7dd3fc; border-color: rgba(125, 211, 252, 0.5); }

  .github-input-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  .github-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    outline: none;
  }

  .btn-confirm {
    padding: 0.5rem 1rem;
    background: #7dd3fc;
    color: #060810;
    border: none;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-cancel {
    padding: 0.5rem 0.75rem;
    background: transparent;
    color: #475569;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .sections { display: flex; flex-direction: column; gap: 2.5rem; }

  .section-title {
    font-size: 1rem;
    font-weight: 500;
    color: #94a3b8;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
  }

  .count-badge {
    background: rgba(255, 255, 255, 0.06);
    color: #475569;
    font-size: 0.7rem;
    padding: 1px 7px;
    border-radius: 20px;
  }

  .streams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
  }

  .empty {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: #334155;
    padding: 1.5rem 0;
  }

  .repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }

  .repo-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 1rem;
    text-decoration: none;
    display: block;
    transition: border-color 0.2s;
  }

  .repo-card:hover { border-color: rgba(125, 211, 252, 0.2); }

  .repo-name {
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: #7dd3fc;
    margin: 0 0 0.4rem;
  }

  .repo-desc {
    font-size: 0.78rem;
    color: #475569;
    margin: 0 0 0.75rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .repo-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }

  .repo-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #334155;
    background: rgba(255, 255, 255, 0.04);
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

</style>
