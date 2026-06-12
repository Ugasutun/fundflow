import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';

export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);
export const horizon = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function getContractValue(
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[] = []
) {
  try {
    const account = await server.getAccount('GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN');
    const contract = new StellarSdk.Contract(contractId);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    return result;
  } catch (e) {
    console.error('Contract call failed:', e);
    return null;
  }
}

export function formatXLM(stroops: string | number): string {
  const val = Number(stroops) / 10_000_000;
  return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export async function getXLMBalance(publicKey: string): Promise<string | null> {
  try {
    const account = await horizon.loadAccount(publicKey);
    const xlmBalance = account.balances.find((b: { asset_type: string }) => b.asset_type === 'native');
    if (!xlmBalance) return null;
    const rawBalance = (xlmBalance as { balance: string }).balance;
    const balance = parseFloat(rawBalance);
    return balance.toLocaleString('en-US', { maximumFractionDigits: 2 });
  } catch (e) {
    console.error('Failed to fetch XLM balance:', e);
    return null;
  }
}

export function xlmToStroops(xlm: number): string {
  return (xlm * 10_000_000).toFixed(0);
}