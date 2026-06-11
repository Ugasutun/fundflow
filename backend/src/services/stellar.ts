import * as StellarSdk from '@stellar/stellar-sdk';

const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const HORIZON_URL = process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const CONTRACT_ID = process.env.CONTRACT_ID || '';
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);
export const horizon = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function getPoolCount(): Promise<number> {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(process.env.ADMIN_ADDRESS || '');
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('pool_count'))
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(result)) {
      return StellarSdk.scValToNative((result as any).result.retval) as number;
    }
    return 0;
  } catch (e) {
    console.error('getPoolCount error:', e);
    return 0;
  }
}

export async function getPool(poolId: number) {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(process.env.ADMIN_ADDRESS || '');
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_pool',
          StellarSdk.nativeToScVal(poolId, { type: 'u64' })
        )
      )
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    return StellarSdk.scValToNative((result as any).result.retval);
    return null;
  } catch (e) {
    console.error('getPool error:', e);
    return null;
  }
}

export async function getApplication(appId: number) {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const account = await server.getAccount(process.env.ADMIN_ADDRESS || '');
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_application',
          StellarSdk.nativeToScVal(appId, { type: 'u64' })
        )
      )
      .setTimeout(30)
      .build();

    const result = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(result) && (result as any).result) {
      return StellarSdk.scValToNative((result as any).result.retval);
    }
    return null;
  } catch (e) {
    console.error('getApplication error:', e);
    return null;
  }
}