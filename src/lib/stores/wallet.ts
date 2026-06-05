import { writable, derived } from 'svelte/store';
import { ethers } from 'ethers';

export const walletAddress = writable<string | null>(null);
export const walletProvider = writable<ethers.BrowserProvider | null>(null);
export const ensName = writable<string | null>(null);
export const isConnecting = writable(false);
export const walletError = writable<string | null>(null);

export const shortAddress = derived(walletAddress, ($addr) => {
  if (!$addr) return null;
  return `${$addr.slice(0, 6)}...${$addr.slice(-4)}`;
});

export async function connectWallet() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    walletError.set('No wallet detected. Install MetaMask or Rabby.');
    return;
  }
  isConnecting.set(true);
  walletError.set(null);
  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const address = ethers.getAddress(accounts[0]);
    walletAddress.set(address);
    walletProvider.set(provider);
    try {
      const name = await provider.lookupAddress(address);
      ensName.set(name);
    } catch {
      ensName.set(null);
    }
    (window as any).ethereum.on('accountsChanged', (accs: string[]) => {
      if (accs.length === 0) disconnectWallet();
      else walletAddress.set(ethers.getAddress(accs[0]));
    });
  } catch (e: any) {
    walletError.set(e?.message ?? 'Connection failed');
  } finally {
    isConnecting.set(false);
  }
}

export function disconnectWallet() {
  walletAddress.set(null);
  walletProvider.set(null);
  ensName.set(null);
}
