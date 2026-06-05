import { GraphQLClient, gql } from 'graphql-request';

const DRIPS_API = 'https://api.drips.network/graphql';
const client = new GraphQLClient(DRIPS_API);

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

const PROJECTS_QUERY = gql`
  query GetProjects($first: Int!) {
    projects(first: $first, orderBy: claimedAt, orderDirection: desc) {
      items {
        id
        name
        description
        url
        splits {
          items {
            receiver { ... on AddressDriverAccount { address } }
            weight
          }
        }
      }
    }
  }
`;

export async function fetchStreams(address: string) {
  try {
    const data: any = await client.request(STREAMS_QUERY, { address: address.toLowerCase() });
    return data.userByAddress ?? null;
  } catch (e) {
    console.error('Drips API error:', e);
    return null;
  }
}

export async function fetchProjects(count = 20) {
  try {
    const data: any = await client.request(PROJECTS_QUERY, { first: count });
    return data.projects?.items ?? [];
  } catch (e) {
    console.error('Drips projects API error:', e);
    return [];
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
