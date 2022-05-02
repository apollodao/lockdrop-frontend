import React, { FC, ReactNode, useEffect, useCallback, useState } from 'react';
import MyLockdropDepositsHeader from './MyLockdropDepositsHeader';
import MyLockdropDepositsRow from './MyLockdropDepositsRow';
import WidgetContainer from './WidgetContainer';
// todo - replace with svg
import xastroIcon from '../public/xastro.png';
import { addressState } from '../data/wallet';
import { useRecoilValue } from 'recoil';
import MyLockdropDepositsEmptyTableRow from './MyLockdropDepositsEmptyTableRow';
import { useLockdrop } from 'hooks/useLockdrop';

type Props = {};

const sampleLockdropDeposits = [
  {
    amount: 15000,
    unlocksOn: '2023-04-06T00:00:00.000Z',
    rewards: 75000,
    percentOfRewards: 0.0075
  },
  {
    amount: 5000,
    unlocksOn: '2022-06-06T00:00:00.000Z',
    rewards: 55000,
    percentOfRewards: 0.0025
  }
];

const MyLockdropDepositsTable: FC<Props> = () => {
  const userWalletAddr = useRecoilValue(addressState);
  const [loading, setLoading] = useState(true); //todo
  const { queryUserLockdropInfo } = useLockdrop();
  const [lockdropRecords, setLockdropRecords] = useState([]);

  const getUserLockdropBalance = useCallback(async () => {
    try {
      const userInfo = await queryUserLockdropInfo(userWalletAddr);

      // TODO - fix with real values from the query
      const userLockdropRecords = userInfo.lockup_infos.map((info: any) => {
        return {
          amount: parseInt(info.units_locked),
          unlocksOn: parseInt(info.unlock_timestamp),
          rewards: parseInt(info.apollo_rewards),
          duration: parseInt(info.duration),
          percentOfRewards: 0
        };
      });
      setLockdropRecords(userLockdropRecords);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getUserLockdropBalance();
      }
      setLoading(false);
    })();
  }, [userWalletAddr]);

  return (
    <WidgetContainer
      title="My Lockdrop Deposits"
      titleFontVariant="body2"
      padding={0}
      style={{ width: '100%' }}>
      <MyLockdropDepositsHeader />
      {!userWalletAddr && (
        <MyLockdropDepositsEmptyTableRow msg="You need to connect your wallet" />
      )}
      {userWalletAddr && lockdropRecords.length <= 0 && (
        <MyLockdropDepositsEmptyTableRow msg="You do not have any lockdrop deposits" />
      )}
      {userWalletAddr &&
        lockdropRecords.length > 0 &&
        lockdropRecords.map((deposit: any, i: number) => {
          const { amount, unlocksOn, rewards, duration } = deposit;
          return (
            <MyLockdropDepositsRow
              key={'row-' + i}
              icon={xastroIcon}
              amount={amount / 1000000}
              unlocksOn={unlocksOn * 1000}
              rewards={rewards / 1000000}
              duration={duration}
              percentOfRewards={rewards / 1000000 / 5000000}
            />
          );
        })}
    </WidgetContainer>
  );
};

export default MyLockdropDepositsTable;
