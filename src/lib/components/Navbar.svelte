<script lang="ts">
  import { walletAddress, shortAddress, ensName, isConnecting, connectWallet, disconnectWallet } from '$lib/stores/wallet';
  import { page } from '$app/state';

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
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(6, 8, 16, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
    color: #e2e8f0;
  }
  .logo-icon { color: #7dd3fc; font-size: 1.2rem; }
  .nav-links { display: flex; gap: 0.25rem; flex: 1; }
  .nav-link {
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
    font-family: 'DM Mono', monospace;
  }
  .nav-link:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
  .nav-link.active { color: #7dd3fc; }
  .wallet-area { display: flex; align-items: center; gap: 0.5rem; }
  .wallet-btn {
    padding: 0.4rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    border: 1px solid rgba(125, 211, 252, 0.3);
    background: rgba(125, 211, 252, 0.08);
    color: #7dd3fc;
    transition: all 0.15s;
  }
  .wallet-btn:hover { background: rgba(125, 211, 252, 0.15); }
  .wallet-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .wallet-btn.connected {
    border-color: rgba(52, 211, 153, 0.3);
    background: rgba(52, 211, 153, 0.08);
    color: #34d399;
  }
  .wallet-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    margin-right: 6px;
    animation: pulse 2s infinite;
  }
  .disconnect-btn {
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #64748b;
    transition: all 0.15s;
  }
  .disconnect-btn:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.3); }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>
