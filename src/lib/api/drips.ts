import { GraphQLClient, gql } from 'graphql-request';

const DRIPS_API = 'https://api.drips.network/graphql';
const client = new GraphQLClient(DRIPS_API);

// Mock projects for when the API is unavailable
const MOCK_PROJECTS = [
  { id: '1', name: 'SvelteKit', description: 'Web development framework for the modern web.', url: 'https://kit.svelte.dev', splits: { items: [{}, {}, {}] } },
  { id: '2', name: 'Ethers.js', description: 'Complete Ethereum library and wallet implementation.', url: 'https://ethers.org', splits: { items: [{}, {}] } },
  { id: '3', name: 'Viem', description: 'TypeScript interface for Ethereum.', url: 'https://viem.sh', splits: { items: [{}, {}, {}, {}] } },
  { id: '4', name: 'Hardhat', description: 'Ethereum development environment for professionals.', url: 'https://hardhat.org', splits: { items: [{}, {}] } },
  { id: '5', name: 'Wagmi', description: 'React hooks for Ethereum.', url: 'https://wagmi.sh', splits: { items: [{}, {}, {}] } },
  { id: '6', name: 'OpenZeppelin', description: 'Secure smart contract library for Ethereum.', url: 'https://openzeppelin.com', splits: { items: [{}, {}, {}, {}, {}] } },
];

const PROJECTS_QUERY = gql`
  query GetProjects($first: Int!) {
    projects(first: $first) {
      items {
        id
        name
        description
        url
        splits {
          items {
            weight
          }
        }
      }
    }
  }
`;

const STREAMS_QUERY = gql`
  query GetStreams($address: String!) {
    userByAddress(address: $address) {
      address
      incomingStreams {
        id
        isPaused
        amountPerSecond { tokenAddress amount }
        streamedSoFar { tokenAddress amount }
        sender { address }
        startTime
      }
      outgoingStreams {
        id
        isPaused
        amountPerSecond { tokenAddress amount }
        receiver { address }
        startTime
      }
    }
  }
`;

export async function fetchProjects(count = 20) {
  try {
    const data: any = await client.request(PROJECTS_QUERY, { first: count });
    const items = data.projects?.items ?? [];
    if (items.length > 0) return items;
    return MOCK_PROJECTS;
  } catch (e) {
    console.warn('Drips API unavailable, using mock data');
    return MOCK_PROJECTS;
  }
}

export async function fetchStreams(address: string) {
  try {
    const data: any = await client.request(STREAMS_QUERY, { address: address.toLowerCase() });
    return data.userByAddress ?? null;
  } catch (e) {
    console.error('Drips streams API error:', e);
    return null;
  }
}

export function formatTokenAmount(raw: string, decimals = 18): string {
  const val = Number(BigInt(raw || '0')) / Math.pow(10, decimals);
  if (val < 0.001) return '< 0.001';
  return val.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

export function perSecondToMonthly(raw: string, decimals = 18): string {
  const perSec = Number(BigInt(raw || '0')) / Math.pow(10, decimals);
  const monthly = perSec * 60 * 60 * 24 * 30;
  return monthly.toLocaleString('en-US', { maximumFractionDigits: 2 });
}