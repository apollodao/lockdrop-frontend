import { useWallet } from '@terra-money/wallet-provider';
import { FINDER } from 'constants/constants';
import networks from '../networks';

const useNetwork = () => {
  const network = networks['classic'];

  const finder = (address: string, path: string = 'account') =>
    `${FINDER}/${network.chainID}/${path}/${address}`;

  return { ...network, finder };
};

export default useNetwork;
