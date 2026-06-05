<script lang="ts">
  import { perSecondToMonthly, formatTokenAmount } from '$lib/api/drips';

  let { stream, direction = 'incoming' }: {
    stream: {
      id: string;
      isPaused: boolean;
      amountPerSecond: { tokenAddress: string; amount: string };
      streamedSoFar: { tokenAddress: string; amount: string };
      sender?: { address: string };
      receiver?: { address: string };
      startTime: string;
    };
    direction?: 'incoming' | 'outgoing';
  } = $props();

  const monthlyAmt = $derived(perSecondToMonthly(stream.amountPerSecond?.amount ?? '0'));
  const totalStreamed = $derived(formatTokenAmount(stream.streamedSoFar?.amount ?? '0'));
  const counterpart = $derived(direction === 'incoming' ? stream.sender?.address : stream.receiver?.address);
  const shortAddr = $derived(counterpart ? `${counterpart.slice(0, 6)}...${counterpart.slice(-4)}` : '—');
  const startDate = $derived(stream.startTime
    ? new Date(Number(stream.startTime) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—');
</script>

<div class="stream-card" class:paused={stream.isPaused}>
  <div class="stream-header">
    <div class="stream-direction" class:incoming={direction === 'incoming'}>
      {direction === 'incoming' ? '↓ Incoming' : '↑ Outgoing'}
    </div>
    <div class="stream-status" class:paused={stream.isPaused}>
      {stream.isPaused ? 'Paused' : 'Active'}
    </div>
  </div>
  <div class="stream-amount">
    <span class="amount-val">{monthlyAmt}</span>
    <span class="amount-unit">DAI / mo</span>
  </div>
  <div class="stream-meta">
    <div class="meta-row">
      <span class="meta-label">{direction === 'incoming' ? 'From' : 'To'}</span>
      <a href={`/profile/${counterpart}`} class="meta-addr">{shortAddr}</a>
    </div>
    <div class="meta-row">
      <span class="meta-label">Total streamed</span>
      <span class="meta-val">{totalStreamed} DAI</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Since</span>
      <span class="meta-val">{startDate}</span>
    </div>
  </div>
  {#if !stream.isPaused}
    <div class="stream-bar"><div class="stream-bar-fill"></div></div>
  {/if}
</div>

<style>
  .stream-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 1.25rem;
    transition: border-color 0.2s;
  }
  .stream-card:hover { border-color: rgba(125, 211, 252, 0.2); }
  .stream-card.paused { opacity: 0.6; }
  .stream-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .stream-direction { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #64748b; letter-spacing: 0.05em; }
  .stream-direction.incoming { color: #34d399; }
  .stream-status {
    font-size: 0.7rem; padding: 2px 8px; border-radius: 20px;
    background: rgba(52, 211, 153, 0.1); color: #34d399;
    border: 1px solid rgba(52, 211, 153, 0.2); font-family: 'DM Mono', monospace;
  }
  .stream-status.paused { background: rgba(100,116,139,0.1); color: #64748b; border-color: rgba(100,116,139,0.2); }
  .stream-amount { display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 1rem; }
  .amount-val { font-size: 1.75rem; font-weight: 600; color: #f1f5f9; font-family: 'DM Mono', monospace; letter-spacing: -0.02em; }
  .amount-unit { font-size: 0.8rem; color: #64748b; font-family: 'DM Mono', monospace; }
  .stream-meta { display: flex; flex-direction: column; gap: 0.4rem; }
  .meta-row { display: flex; justify-content: space-between; font-size: 0.8rem; }
  .meta-label { color: #475569; font-family: 'DM Mono', monospace; }
  .meta-val { color: #94a3b8; }
  .meta-addr { color: #7dd3fc; text-decoration: none; font-family: 'DM Mono', monospace; }
  .meta-addr:hover { text-decoration: underline; }
  .stream-bar { margin-top: 1rem; height: 2px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
  .stream-bar-fill {
    height: 100%; width: 60%;
    background: linear-gradient(90deg, #7dd3fc, #34d399);
    border-radius: 2px;
    animation: flow 3s ease-in-out infinite;
  }
  @keyframes flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
</style>
