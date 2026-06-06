<script lang="ts">
  import { wallet, shortAddress, isConnected } from '$lib/stores/wallet';
  import { page } from '$app/stores';

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/explore', label: 'Explore' },
    { href: '/profile', label: 'Profile' }
  ];
</script>

<nav class="nav">
  <a href="/" class="logo">
    <span class="logo-mark">◈</span>
    DripsFlow
  </a>

  <div class="nav-links">
    {#each links as link}
      <a
        href={link.href}
        class="nav-link"
        class:active={$page.url.pathname.startsWith(link.href)}
      >
        {link.label}
      </a>
    {/each}
  </div>

  <div class="wallet-section">
    {#if $isConnected}
      <div class="wallet-badge">
        <span class="glow-dot"></span>
        <span class="wallet-addr">{$shortAddress}</span>
      </div>
      <button class="btn-ghost" on:click={() => wallet.disconnect()}>Disconnect</button>
    {:else}
      <button
        class="btn-connect"
        on:click={() => wallet.connect()}
        disabled={$wallet.state === 'connecting'}
      >
        {$wallet.state === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
      </button>
    {/if}
  </div>
</nav>

<style>
  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
    border-bottom: 0.5px solid var(--color-border);
    backdrop-filter: blur(8px);
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-nav-surface);
  }

  .logo {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--color-brand);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: -0.02em;
  }

  .logo-mark { font-size: 20px; }

  .nav-links {
    display: flex;
    gap: 0.25rem;
    flex: 1;
  }

  .nav-link {
    font-family: var(--font-display);
    font-size: 14px;
    color: var(--color-text-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
  }

  .nav-link:hover, .nav-link.active {
    color: var(--color-text);
    background: var(--color-brand-hover-bg);
  }

  .nav-link.active { color: var(--color-brand); }

  .wallet-section { display: flex; align-items: center; gap: 8px; margin-left: auto; }

  .wallet-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 0.5px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface-1);
  }

  .wallet-addr { font-size: 13px; color: var(--color-text-muted); }

  .btn-connect {
    background: var(--color-brand);
    color: var(--color-brand-on);
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-connect:hover { opacity: 0.88; }
  .btn-connect:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    background: transparent;
    border: 0.5px solid var(--color-border);
    color: var(--color-text-muted);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-ghost:hover { border-color: var(--color-brand); color: var(--color-text); }
</style>
