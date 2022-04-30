import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  Fee
} from '@terra-money/terra.js';
import { useRecoilValue } from 'recoil';
import networks, {
  isSupportedNetwork,
  SupportedNetwork
} from '../store/networks';
import { networkNameState } from '../data/network';
import { TxResult, useWallet } from '@terra-money/wallet-provider';
import { lcdClientQuery } from '../data/network';
import { addressState } from '../data/wallet';
import useFee from './useFee';
import axios from 'axios';

// an example hook for a contract.
// e.g. cw3
// Todo: replace message types (currently any) with real types.
// replace useContract with contract name/type.
// add executions using execute template.
// add queries using query template.

// From lockdrop integration test:
//
// executions:
// 1. Deposit 1000000 Astro into Astroport Staking for 1000000 xAstro with Wallet 1 - astroportStaking.enterAstroToken('1000000', astroToken)
// 2. Deposit 1000000 xAstro for 52 weeks with Wallet 1 - apollo.lockdrop.depositAsset('1000000', 52, xAstroToken)
// 3. Deposit 1000000 Astro for 26 weeks with Wallet 1 - apollo.lockdrop.depositAstroAndIncreaseLockup('1000000', 26, xAstroToken)
//
// queries:
// 1.  Wallet 1 Lockup Positions - apollo.lockdrop.getUserInfo - wallet.key.accAddress contracts.astroport.xastroToken
//   assert(wallet1Query.lockup_positions_index == 1); // Check that there is 1 lockup position
//   assert(wallet1Query.lockup_infos[0].units_locked == '1000000'); // Check that the lockup position has 1000000 xAstro locked
//   assert(wallet1Query.lockup_infos[0].weighted_sum == '6900000'); // Check that the lockdrop position has 6900000 apAstro
//
// 2.  'Wallet 1 query after second deposit using astro token as deposit' - apollo.lockdrop.getUserInfo - wallet.key.accAddress contracts.astroport.xastroToken
//     assert(userQueryAfter2ndDeposit.lockup_positions_index == 2); // Check that there are 2 lockup positions
//     assert(userQueryAfter2ndDeposit.lockup_infos[0].units_locked == '1000000'); // Check that the second lockup position has 1000000 xAstro locked
//     assert(userQueryAfter2ndDeposit.lockup_infos[0].weighted_sum == '2400000'); // Check that the second lockup position has 2400000 apAstro
//
// tests:
// 1.'Deposit 1000000 Astro into Astroport Staking for 1000000 xAstro with Wallet 1'
// 2.'Deposit 1000000 Astro for 26 weeks with Wallet 1'
//

export const useLockdrop = (contractAddress?: AccAddress) => {
  let networkName = useRecoilValue(networkNameState);
  if (!networkName || !isSupportedNetwork(networkName)) { networkName = 'mainnet'; }

  const lockdropAddress =
    networks[networkName as SupportedNetwork].contracts.apolloLockdrop;
  const xastroTokenAddress =
    networks[networkName as SupportedNetwork].contracts.xastro_token;

  const { post } = useWallet();
  const fee = useFee();
  const userWalletAddr = useRecoilValue(addressState);
  const lcdClient = useRecoilValue(lcdClientQuery);

  // prepare execution
  const createExecuteMsg = (executeMsg: any, coins?: Coins.Input) => {
    return new MsgExecuteContract(
      userWalletAddr,
      lockdropAddress,
      executeMsg,
      coins
    );
  };

  const executeExample = (proposalId: number): Promise<TxResult> => {
    const executeMsg = createExecuteMsg({
      execute: { proposalId }
    });

    return post({
      msgs: [executeMsg],
      fee: new Fee(fee.gas, { uusd: fee.amount })
    });
  };

  // execute the deposit by 'sending' the xAstro token to the contract
  const executeDepositAsset = (amount: number, duration: number): Promise<TxResult> => {
    const executeMsg = createExecuteMsg({
      amount,
      duration,
      xastroTokenAddress
    });
    return post({
      msgs: [executeMsg],
      fee: new Fee(fee.gas, { uusd: fee.amount })
    });
  };

  // query
  const query = <T>(queryMsg: any) => {
    return lcdClient.wasm.contractQuery<T>(contractAddress, queryMsg);
  };

  // get xAstro token balance from the xAstro contract
  const queryWalletxAstroBalance: any = async (userWalletAddress: AccAddress): Promise<TxResult> => {
    return lcdClient.wasm.contractQuery(xastroTokenAddress, { balance: { address: userWalletAddress } });
  };

  // get user's lockdrop info
  const queryUserLockdropInfo: any = async (userWalletAddress: AccAddress): Promise<TxResult> => {
    try {
      if (!userWalletAddress) {
        return null;
      }
      const result = await axios.get(`https://api.apollo.farm/lockdrop/get_user_info/${userWalletAddress}/${networkName}`);
      return result.data;
    } catch (e) {
      console.error(e);
    }
  };

  // get total lockdrop stats
  const queryTotalLockdropInfo: any = async (): Promise<TxResult> => {
    // todo - fix endpoint to point to total lockdrop info
    return axios.get(`https://api.apollo.farm/lockdrop/get_user_info/${lockdropAddress}/${networkName}`);
  };

  return {
    executeDepositAsset,
    executeExample,
    queryWalletxAstroBalance,
    queryUserLockdropInfo,
    queryTotalLockdropInfo
  };
};
