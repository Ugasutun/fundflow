<script lang="ts">
  import { walletAddress, shortAddress, ensName, isConnecting, connectWallet, disconnectWallet } from '$lib/stores/wallet';
  import { theme } from '$lib/stores/theme';
  import { page } from '$app/state';
  import { SunIcon, MoonIcon } from 'heroicons-svelte/24/solid';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
  ];

  function handleProfile() {
    if ($walletAddress) {
      window.location.href = `/profile/${$walletAddress}`;
    }
  }
</script>

<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <span class="logo-icon">◈</span>
      <span class="logo-text">DripsFlow</span>
    </a>
    <div class="nav-links">
      {#each links as link}
        <a href={link.href} class="nav-link" class:active={page.url.pathname === link.href}>
          {link.label}
        </a>
      {/each}
    </div>
    <div class="wallet-area">
      {#if $walletAddress}
        <button class="wallet-btn connected" onclick={handleProfile}>
          <span class="wallet-dot"></span>
          {$ensName ?? $shortAddress}
        </button>
        <button class="disconnect-btn" onclick={disconnectWallet} title="Disconnect">✕</button>
      {:else}
        <button class="wallet-btn" onclick={connectWallet} disabled={$isConnecting}>
          {$isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      {/if}
    </div>
    <div class="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        class="theme-btn"
        class:active={$theme === 'light'}
        onclick={() => theme.set('light')}
        title="Light mode"
        aria-label="Light mode"
        aria-pressed={$theme === 'light'}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        class="theme-btn"
        class:active={$theme === 'dark'}
        onclick={() => theme.set('dark')}
        title="Dark mode"
        aria-label="Dark mode"
        aria-pressed={$theme === 'dark'}
      >
        <MoonIcon />
      </button>
    </div>
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-nav-border);
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-family: 'DM Mono', monospace;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-nav-text-hover);
  }
  .logo-icon { color: var(--color-nav-accent); font-size: 1.2rem; }
  .nav-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-link {
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--color-nav-text);
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
    font-family: 'DM Mono', monospace;
  }
  .nav-link:hover { color: var(--color-nav-text-hover); background: var(--color-hover-overlay); }
  .nav-link.active { color: var(--color-nav-accent); }
  .wallet-area { display: flex; align-items: center; gap: 0.5rem; }
  .wallet-btn {
    padding: 0.4rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    border: 1px solid var(--color-accent-border-emphasis);
    background: var(--color-accent-bg);
    color: var(--color-accent);
    transition: all 0.15s;
  }
  .wallet-btn:hover { background: var(--color-accent-border-faint); }
  .wallet-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .wallet-btn.connected {
    border-color: var(--color-success-border-emphasis);
    background: var(--color-success-bg);
    color: var(--color-success);
  }
  .wallet-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-success);
    margin-right: 6px;
    animation: pulse 2s infinite;
  }
  .disconnect-btn {
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    border: 1px solid var(--color-border-subtle);
    background: transparent;
    color: var(--color-text-subtle);
    transition: all 0.15s;
  }
  .disconnect-btn:hover { color: var(--color-error); border-color: var(--color-error-border); }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.2rem;
    border-radius: 8px;
    border: 1px solid var(--color-toggle-border);
    background: var(--color-toggle-bg);
  }
  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--color-toggle-icon);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .theme-btn:hover {
    color: var(--color-toggle-icon-hover);
    background: var(--color-hover-overlay);
  }
  .theme-btn.active {
    color: var(--color-toggle-active);
    background: var(--color-toggle-active-bg);
  }
  .theme-btn :global(svg) {
    width: 1rem;
    height: 1rem;
  }
</style>
