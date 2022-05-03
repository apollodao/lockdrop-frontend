import {
  AccAddress,
  Coins,
  MsgExecuteContract,
  Fee,
  Int,
  Numeric
} from '@terra-money/terra.js';
import { useRecoilValue, useSetRecoilState } from 'recoil';
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

// the official start date and time in utc
const LOCKDROP_START_DATE = Date.UTC(2022, 4, 2, 0, 0, 0);

export const useLockdrop = (contractAddress?: AccAddress) => {
  let networkName = useRecoilValue(networkNameState);
  if (!networkName || !isSupportedNetwork(networkName)) {
    networkName = 'mainnet';
  }

  const lockdropAddress =
    networks[networkName as SupportedNetwork].contracts.apolloLockdrop;
  const xastroTokenAddress =
    networks[networkName as SupportedNetwork].contracts.xastro_token;
  const astroTokenAddress =
    networks[networkName as SupportedNetwork].contracts.astro_token;

  const { post } = useWallet();
  const fee = useFee();
  const userWalletAddr = useRecoilValue(addressState);
  const lcdClient = useRecoilValue(lcdClientQuery);

  // implement logic to provide helpers for phase start and end dates
  const buildLockdropDateConfig: any = async (startDate: Date) => {
    const currentDate = new Date();
    const config = {
      startDate: startDate,
      endDate: null,
      currentStage: 'pre',
      phases: [
        {
          title: 'stage1',
          startDate: startDate,
          duration: 5
        },
        {
          title: 'stage2',
          startDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000),
          duration: 2
        }
      ]
    };
    config.endDate = new Date(
      config.startDate.getTime() +
        config.phases.reduce((acc, phase) => acc + phase.duration, 0) *
          24 *
          60 *
          60 *
          1000
    );

    // current stage logic
    config.phases.map((phase: any) => {
      if (currentDate.getTime() > phase.startDate.getTime()) {
        config.currentStage = phase.title;
      }
    });
    if (currentDate.getTime() > config.endDate.getTime()) {
      config.currentStage = 'post';
    }

    return config;
  };

  // get xAstro token balance from the xAstro contract
  const queryContractConfig: any = async (): Promise<TxResult> => {
    return lcdClient.wasm.contractQuery(lockdropAddress, {
      config: {}
    });
  };

  // get the current lockdrop date config
  const lockdropConfig: any = async () => {
    try {
      const config = await queryContractConfig();
      return buildLockdropDateConfig(new Date(config.init_timestamp * 1000));
    } catch (e) {
      console.error('error getting contract config and start date', e);
    }
  };

  // prepare execution
  const createExecuteMsg = (executeMsg: any, coins?: Coins.Input) => {
    return new MsgExecuteContract(
      userWalletAddr,
      lockdropAddress,
      executeMsg,
      coins
    );
  };

  // base64 encode
  function createHookMsg(msg: any): string {
    return Buffer.from(JSON.stringify(msg)).toString('base64');
  }

  // astro/xastro deposit message
  function createDepositMessage(
    deposit_token: 'xastro' | 'astro',
    duration: number,
    amount: Numeric.Input
  ): MsgExecuteContract {
    const executeMsg = {
      send: {
        contract: lockdropAddress,
        amount: new Int(amount).toString(),
        msg: createHookMsg(
          deposit_token === 'xastro'
            ? {
                increase_lockup: {
                  duration
                }
              }
            : {
                stake_astro_and_increase_lockup: {
                  duration
                }
              }
        )
      }
    };

    return new MsgExecuteContract(
      userWalletAddr,
      deposit_token === 'xastro' ? xastroTokenAddress : astroTokenAddress,
      executeMsg
    );
  }

  // astro/xastro withdraw message
  function createWithdrawMessage(
    duration: number,
    amount: Numeric.Input
  ): MsgExecuteContract {
    const executeMsg = {
      withdraw_from_lockup: {
        amount: amount.toString(),
        duration,
        token_address: xastroTokenAddress
      }
    };

    return new MsgExecuteContract(userWalletAddr, lockdropAddress, executeMsg);
  }

  // execute the deposit by 'sending' the xAstro token to the contract
  const executeDepositAsset = (
    deposit_token: 'xastro' | 'astro',
    amount: number,
    duration: number
  ): Promise<TxResult> => {
    const executeMsg = createDepositMessage(deposit_token, duration, amount);
    return post({
      msgs: [executeMsg],
      fee: new Fee(fee.gas, { uusd: fee.amount })
    });
  };

  // execute withdraw
  const executeWithdrawAsset = (
    duration: number,
    amount: number
  ): Promise<TxResult> => {
    const executeMsg = createWithdrawMessage(duration, amount);
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
  const queryWalletxAstroBalance: any = async (
    userWalletAddress: AccAddress
  ): Promise<TxResult> => {
    return lcdClient.wasm.contractQuery(xastroTokenAddress, {
      balance: { address: userWalletAddress }
    });
  };

  // get user's lockdrop info
  const queryUserLockdropInfo: any = async (
    userWalletAddress: AccAddress
  ): Promise<TxResult> => {
    try {
      if (!userWalletAddress) {
        return null;
      }
      const result = await axios.get(
        `https://api.apollo.farm/lockdrop/get_user_info/${userWalletAddress}/${networkName}`
      );

      return result.data;
    } catch (e) {
      console.error(e);
    }
  };

  // get total lockdrop stats
  const queryTotalLockdropInfo: any = async (): Promise<TxResult> => {
    try {
      const result = await axios.get(
        `https://api.apollo.farm/lockdrop/info/${networkName}`
      );
      return result.data;
    } catch (e) {
      console.error(e);
    }
  };

  // get astro and x astro price
  const queryPrices: any = async (): Promise<TxResult> => {
    try {
      const result = await axios.get(`https://api.apollo.farm/lockdrop/prices`);
      return result.data;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    lockdropConfig,
    executeDepositAsset,
    executeWithdrawAsset,
    queryWalletxAstroBalance,
    queryUserLockdropInfo,
    queryTotalLockdropInfo,
    queryPrices
  };
};
