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
          amount: info.amount,
          unlocksOn: info.unlocks_on,
          rewards: info.amount,
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
          const { amount, unlocksOn, rewards, percentOfRewards } = deposit;
          return (
            <MyLockdropDepositsRow
              key={'row-' + i}
              icon={xastroIcon}
              amount={amount}
              unlocksOn={unlocksOn}
              rewards={rewards}
              percentOfRewards={percentOfRewards}
            />
          );
        })}
    </WidgetContainer>
  );
};

export default MyLockdropDepositsTable;
