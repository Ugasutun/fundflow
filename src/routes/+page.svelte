<script lang="ts">
  import { walletAddress, connectWallet, isConnecting } from '$lib/stores/wallet';
  import { goto } from '$app/navigation';
  import {ethers} from 'ethers';
  let searchInput = $state('');
  let searchError = $state('');
  function handleExplore() { goto('/explore'); }
  function handleProfile() {
    if ($walletAddress) goto(`/profile/${$walletAddress}`);
    else connectWallet();
  }
  async function handleSearch(){
    searchError = '';
    const query = searchInput.trim();
    if (!query){
      return;
    }
    try{
      // Wallet address
      if(ethers.isAddress(query)){
        goto(`/profile/${query}`);
        return;
      }
      //ENS name
      const provider = ethers.getDefaultProvider();

      const address = await provider.resolveName(query);

      if (!address) {
        searchError = 'ENS name could not be resolved';
        return;
      }

      goto(`/profile/${address}`);
          }
    catch{
      searchError = 'Invalid wallet address or ENS name';
    }
  }
</script>

<svelte:head>
  <title>FundFlow — Web3 Contributor Funding</title>
</svelte:head>

<section class="hero">
  <div class="hero-tag">Open-source · Web3 · On-chain</div>
  <h1 class="hero-title">
    Track your<br/>
    <span class="accent">funding streams</span><br/>
    on FundFlow
  </h1>
  <p class="hero-sub">
    Connect your wallet to see your real-time funding streams, contribution history,
    and how much you've earned across Web3 open-source projects.
  </p>
  <div class="search-container">
    <input class="search-input" bind:value={searchInput} 
    type="text" placeholder="Enter wallet address or ENS name" 
    onkeydown={(e) => e.key === 'Enter' && handleSearch()}/>
    <button class="btn-ghost" onclick={handleSearch}>
      Search
    </button>
  </div>

  {#if searchError}
    <p class="search-error">{searchError}</p>
  {/if}
  <div class="hero-actions">
    <button class="btn-primary" onclick={handleProfile} disabled={$isConnecting}>
      {$walletAddress ? 'View my profile' : $isConnecting ? 'Connecting...' : 'Connect wallet'}
    </button>
    <button class="btn-ghost" onclick={handleExplore}>
      Explore projects →
    </button>
  </div>
</section>

<section class="features">
  {#each [
    { icon: '⟳', title: 'Live streams', desc: 'Real-time DAI/ETH funding streams from the Drips protocol, updated every block.' },
    { icon: '◈', title: 'Contributor profile', desc: 'Merge your GitHub identity with your on-chain wallet — one unified view of your work.' },
    { icon: '↗', title: 'Project explorer', desc: 'Discover Web3 open-source projects actively funding contributors via Drips.' },
  ] as f}
    <div class="feature-card">
      <div class="feature-icon">{f.icon}</div>
      <h3 class="feature-title">{f.title}</h3>
      <p class="feature-desc">{f.desc}</p>
    </div>
  {/each}
</section>

<style>
  .hero {
    text-align: center;
    padding: 5rem 0 4rem;
    max-width: 700px;
    margin: 0 auto;
  }
  .hero-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: var(--color-text-dim);
    margin-bottom: 1.5rem;
    text-transform: uppercase;
  }
  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 600;
    line-height: 1.1;
    color: var(--color-heading);
    margin: 0 0 1.5rem;
    letter-spacing: -0.02em;
  }
  .accent { color: var(--color-accent); }
  .hero-sub {
    font-size: 1.05rem;
    color: var(--color-text-subtle);
    line-height: 1.7;
    margin: 0 0 2.5rem;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .btn-primary {
    padding: 0.7rem 1.75rem;
    background: var(--color-accent);
    color: var(--color-text-on-accent);
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }
  .btn-primary:hover { background: var(--color-accent-hover); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost {
    padding: 0.7rem 1.5rem;
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border-muted);
    border-radius: 10px;
    font-size: 0.9rem;
    font-family: 'DM Mono', monospace;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .btn-ghost:hover { color: var(--color-text); border-color: var(--color-border-hover); }
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  .feature-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: 14px;
    padding: 1.5rem;
    transition: border-color 0.2s;
  }
  .search-container {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .search-input {
    width: min(420px, 100%);
    padding: 0.7rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--color-border-muted);
    background: var(--color-card-bg);
    color: var(--color-text);
    font-family: inherit;
  }

  .search-error {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
  .feature-card:hover { border-color: var(--color-accent-border-card-subtle); }
  .feature-icon { font-size: 1.4rem; margin-bottom: 0.75rem; color: var(--color-accent); }
  .feature-title { font-size: 1rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.5rem; }
  .feature-desc { font-size: 0.85rem; color: var(--color-text-subtle); line-height: 1.6; margin: 0; }
</style>