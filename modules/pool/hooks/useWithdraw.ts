import { useMemo } from "react";
import { useAddress, useTransaction, TxStep, num } from "@arthuryeti/terra";

import { ONE_TOKEN } from "constants/constants";
import { getTokenDenom } from "modules/common";
import { useTokenPriceInUst } from "modules/swap";
import { createWithdrawMsgs, useGetPool } from "modules/pool";

export type WithdrawState = {
  token1?: string;
  token1Amount?: string;
  token1Price: string;
  token2?: string;
  token2Amount?: string;
  token2Price: string;
  error: any;
  fee: any;
  txHash?: string;
  txStep: TxStep;
  reset: () => void;
  withdraw: () => void;
};

type Params = {
  contract: string;
  lpToken: string;
  amount: string | null;
  onSuccess?: (txHash: string) => void;
  onError?: (txHash?: string) => void;
};

export const useWithdraw = ({
  contract,
  lpToken,
  amount,
  onSuccess,
  onError,
}: Params): WithdrawState => {
  const { data: pool } = useGetPool(contract);
  const address = useAddress();

  const ratio: any = useMemo(() => {
    if (pool == null) {
      return {};
    }

    return pool.assets.reduce((prev, a) => {
      return {
        ...prev,
        [getTokenDenom(a.info)]: Number(a.amount) / Number(pool.total_share),
      };
    }, {});
  }, [pool]);

  const tokens = useMemo(() => {
    if (pool == null || ratio == null || amount == null) {
      return {};
    }

    const token1 = getTokenDenom(pool.assets[0].info);
    const token2 = getTokenDenom(pool.assets[1].info);

    return {
      token1,
      token2,
      token1Amount: num(amount).times(ratio[token1]).div(ONE_TOKEN).toFixed(6),
      token2Amount: num(amount).times(ratio[token2]).div(ONE_TOKEN).toFixed(6),
    };
  }, [pool, ratio, amount]);

  // @ts-expect-error
  const token1Price = useTokenPriceInUst(tokens.token1);
  // @ts-expect-error
  const token2Price = useTokenPriceInUst(tokens.token2);

  const msgs = useMemo(() => {
    if (amount == null) {
      return [];
    }

    return createWithdrawMsgs(
      {
        contract,
        lpToken,
        amount,
      },
      address
    );
  }, [address, contract, lpToken, amount]);

  const { submit, ...rest } = useTransaction({
    msgs,
    onSuccess,
    onError,
  });

  return {
    ...tokens,
    token1Price,
    token2Price,
    ...rest,
    withdraw: submit,
  };
};

export default useWithdraw;
