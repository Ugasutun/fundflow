export interface Stream {
  id: string;
  sender: string;
  senderEns?: string;
  receiver: string;
  tokenSymbol: string;
  tokenAddress: string;
  amountPerSecond: string;
  totalStreamed: string;
  startDate: number;
  active: boolean;
  projectName?: string;
  projectAvatar?: string;
}

export interface Contributor {
  address: string;
  ens?: string;
  github?: string;
  avatar?: string;
  totalEarned: Record<string, string>;
  activeStreams: number;
  resolvedIssues: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  github: string;
  logo?: string;
  totalFunded: string;
  token: string;
  contributorsCount: number;
  activeStreams: number;
  grantStatus: 'active' | 'seeking' | 'completed';
  tags: string[];
}

export interface Issue {
  id: number;
  title: string;
  url: string;
  repo: string;
  closedAt: string;
  linkedPayout?: string;
  linkedToken?: string;
}

export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error';
