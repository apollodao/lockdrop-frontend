import { AccAddress } from '@terra-money/terra.js';

export const supportedNetworks = ['mainnet', 'testnet', 'localterra'] as const;
export type SupportedNetwork = typeof supportedNetworks[number];

export function isSupportedNetwork(
  network: string
): network is SupportedNetwork {
  return supportedNetworks.includes(network as SupportedNetwork);
}

export type ExtNetworkConfig = {
  name: SupportedNetwork;
  chainID: string;
  lcd: string;
};

export type LocalNetworkConfig = {
  /** Contract Addresses */
  contracts: {
    apolloLockdrop: AccAddress;
  };
  /** Fixed fee */
  fee: { gasPrice: number; amount: number };
  stats: string;
  apollo_fcd: string;
};

export const networks: { [k in SupportedNetwork]: LocalNetworkConfig } = {
  mainnet: {
    contracts: {
      apolloLockdrop: ''
    },
    fee: { gasPrice: 0.15, amount: 100000 }, // 0.1 UST
    stats: 'https://graphql.apollo.farm/graphql',
    apollo_fcd: 'https://price-api-mainnet.apollo.farm/v1'
  },
  testnet: {
    contracts: {
      apolloLockdrop: 'terra1sft9p4h9n0mggawzw77jplwlvrr6upav6s4y40'
    },
    stats: 'https://graphql.apollo.farm/graphql',
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.15 UST
    apollo_fcd: 'https://price-api-bombay.apollo.farm/v1'
  },
  localterra: {
    contracts: {
      apolloLockdrop: ''
    },
    stats: '',
    fee: { gasPrice: 0.15, amount: 150000 }, // 0.15 UST
    apollo_fcd: 'http://localhost:3060/v1'
  }
};

export default networks;
