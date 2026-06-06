<script lang="ts">
  import { page } from '$app/state';
  import { onDestroy, onMount } from 'svelte';
  import { fetchStreams } from '$lib/api/drips';
  import { fetchGithubUser, fetchGithubRepos } from '$lib/api/github';
  import StreamCard from '$lib/components/StreamCard.svelte';

  const address = $derived(page.params.address);
  const shortAddr = $derived(address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '');

  let streams: any = $state(null);
  let githubUser: any = $state(null);
  let repos: any[] = $state([]);
  let loading = $state(true);
  let githubInput = $state('');
  let showGithubInput = $state(false);
  let copyFeedback = $state<'idle' | 'copied'>('idle');
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(async () => {
    streams = await fetchStreams(address);
    loading = false;
  });

  onDestroy(() => {
    if (copyResetTimer) clearTimeout(copyResetTimer);
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

  async function copyProfileLink() {
    if (!address) return;

    const profileUrl = `https://dripsflow.vercel.app/profile/${address}`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(profileUrl);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = profileUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    copyFeedback = 'copied';
    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyFeedback = 'idle';
      copyResetTimer = null;
    }, 2000);
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
    <button class="copy-profile-btn" onclick={copyProfileLink} aria-live="polite">
      {copyFeedback === 'copied' ? 'Copied!' : 'Copy link'}
    </button>
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
  <div class="state-msg"><div class="spinner"></div> Loading streams from Drips...</div>
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
    border-bottom: 1px solid var(--color-divider);
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--color-accent-bg-strong);
    border: 1px solid var(--color-accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .avatar-img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-placeholder { font-size: 1.5rem; color: var(--color-accent); }

  .profile-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-heading);
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
  }

  .profile-handle {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: var(--color-text-dim);
    margin: 0 0 0.5rem;
  }

  .profile-bio { font-size: 0.875rem; color: var(--color-text-subtle); margin: 0; }
  .addr-mono { font-family: 'DM Mono', monospace; }

  .copy-profile-btn {
    background: var(--color-accent-bg);
    border: 1px solid var(--color-accent-border-strong);
    color: var(--color-accent);
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 0.65rem;
  }

  .copy-profile-btn:hover {
    background: var(--color-accent-bg-hover);
    border-color: var(--color-accent-border-hover);
  }

  .link-github-btn {
    background: none;
    border: 1px dashed var(--color-accent-border-dashed);
    color: var(--color-text-dim);
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 0.25rem;
  }

  .link-github-btn:hover { color: var(--color-accent); border-color: var(--color-accent-border-dashed-hover); }

  .github-input-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  .github-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: var(--color-input-bg);
    border: 1px solid var(--color-input-border-strong);
    border-radius: 8px;
    color: var(--color-text);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    outline: none;
  }

  .btn-confirm {
    padding: 0.5rem 1rem;
    background: var(--color-accent);
    color: var(--color-text-on-accent);
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
    color: var(--color-text-dim);
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .sections { display: flex; flex-direction: column; gap: 2.5rem; }

  .section-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
  }

  .count-badge {
    background: var(--color-badge-bg);
    color: var(--color-text-dim);
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
    color: var(--color-text-faint);
    padding: 1.5rem 0;
  }

  .repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }

  .repo-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: 10px;
    padding: 1rem;
    text-decoration: none;
    display: block;
    transition: border-color 0.2s;
  }

  .repo-card:hover { border-color: var(--color-accent-border-card); }

  .repo-name {
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: var(--color-accent);
    margin: 0 0 0.4rem;
  }

  .repo-desc {
    font-size: 0.78rem;
    color: var(--color-text-dim);
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
    color: var(--color-text-faint);
    background: var(--color-tag-bg);
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid var(--color-card-border);
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

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--color-spinner-track);
    border-top-color: var(--color-spinner-head);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
</style>
