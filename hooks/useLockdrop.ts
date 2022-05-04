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
import { lockdropConfig } from '../data/lockdropConfig';
import useFee from './useFee';
import axios from 'axios';
import { useEffect } from 'react';

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
  const setLockdropConfig = useSetRecoilState(lockdropConfig);

  // implement logic to provide helpers for phase start and end dates
  const buildLockdropConfig: any = (contractInfo: any) => {
    const {
      init_timestamp,
      deposit_window,
      withdrawal_window
    } = contractInfo;

    let contractInitDate = new Date(init_timestamp * 1000);
    const currentDate = new Date();

    // hardcode the official start date for testing, guard against it happening in prod
    // if (window.location.href.indexOf('localhost') >= 0) {
    //   contractInitDate = new Date(Date.UTC(2022, 3, 29, 0, 0, 0));
    // }

    // this is the primary place where the phases are defined based off of the incoming startDate that came from the contract itself
    const config = {
      startDate: contractInitDate,
      endDate: null,
      currentStage: 'pre',
      currentDay: Math.ceil((currentDate.getTime() - contractInitDate.getTime()) / (1000 * 60 * 60 * 24)),
      phases: [
        {
          title: 'stage1',
          startDate: contractInitDate,
          duration: deposit_window / (60 * 60 * 24)
        },
        {
          title: 'stage2',
          startDate: new Date(contractInitDate.getTime() + 5 * 24 * 60 * 60 * 1000),
          duration: withdrawal_window / (60 * 60 * 24)
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

    console.log('got config', config);

    return config;
  };

  // get xAstro token balance from the xAstro contract
  const queryContractConfig: any = async (): Promise<TxResult> => {
    return lcdClient.wasm.contractQuery(lockdropAddress, {
      config: {}
    });
  };

  // init lockdrop config
  const initLockdropConfig: any = async () => {
    const contractInfo = await queryContractConfig();
    console.log('contract info', contractInfo);
    const config = buildLockdropConfig(contractInfo);
    setLockdropConfig(config);
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

  // get Astro token balance from the xAstro contract
  const queryWalletAstroBalance: any = async (
    userWalletAddress: AccAddress
  ): Promise<TxResult> => {
    return lcdClient.wasm.contractQuery(astroTokenAddress, {
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
    initLockdropConfig,
    executeDepositAsset,
    executeWithdrawAsset,
    queryWalletxAstroBalance,
    queryWalletAstroBalance,
    queryUserLockdropInfo,
    queryTotalLockdropInfo,
    queryPrices
  };
};
