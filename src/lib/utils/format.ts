export function formatAddress(addr: string, ens?: string | null): string {
  if (ens) return ens;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatAmount(amount: string, decimals = 2): string {
  const n = parseFloat(amount);
  if (isNaN(n)) return '0.00';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Convert amountPerSecond (wei-like string) to human-readable per-month */
export function perSecondToMonthly(perSecond: string, decimals = 18): string {
  const raw = BigInt(perSecond);
  const monthlyWei = raw * BigInt(30 * 24 * 3600);
  const divisor = BigInt(10 ** decimals);
  const whole = monthlyWei / divisor;
  const frac = (monthlyWei % divisor) * 100n / divisor;
  return `${whole}.${frac.toString().padStart(2, '0')}`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() / 1000 - timestamp;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / (86400 * 30))}mo ago`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function grantStatusColor(status: string): string {
  return status === 'active' ? '#1D9E75'
    : status === 'seeking' ? '#EF9F27'
    : '#7aab93';
}

export function grantStatusLabel(status: string): string {
  return status === 'active' ? 'Actively funded'
    : status === 'seeking' ? 'Seeking grants'
    : 'Completed';
}
