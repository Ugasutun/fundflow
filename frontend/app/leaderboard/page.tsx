import { getLeaderboard } from '@/lib/api';

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const period = resolvedSearchParams.period === 'month' ? 'month' : 'all';
  const entries = await getLeaderboard(period);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            Contributor leaderboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Top contributors ranked by total XLM received
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/leaderboard"
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              period === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            All time
          </a>
          <a
            href="/leaderboard?period=month"
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              period === 'month'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            This month
          </a>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-mono text-sm border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          No contributions found yet.
        </div>
      ) : (
        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-mono uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-900">
            <div className="col-span-1">Rank</div>
            <div className="col-span-6">Address</div>
            <div className="col-span-3 text-right">Total XLM</div>
            <div className="col-span-2 text-right">Grants</div>
          </div>
          {entries.map((entry, idx) => (
            <div
              key={entry.address}
              className={`grid grid-cols-12 gap-4 px-5 py-4 items-center ${
                idx !== entries.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-800'
                  : ''
              }`}
            >
              <div className="col-span-1 text-sm font-semibold text-gray-500">
                #{idx + 1}
              </div>
              <div className="col-span-6">
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${entry.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-blue-600 hover:underline"
                >
                  {entry.address.slice(0, 6)}...{entry.address.slice(-6)}
                </a>
              </div>
              <div className="col-span-3 text-right font-mono text-sm text-gray-900 dark:text-gray-100">
                {entry.totalReceived.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="col-span-2 text-right font-mono text-sm text-gray-500">
                {entry.grantCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
