import React, { FC, ReactNode, useEffect, useCallback, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import MyLockdropDepositsHeader from './MyLockdropDepositsHeader';
import MyLockdropDepositsRow from './MyLockdropDepositsRow';
import WidgetContainer from './WidgetContainer';
// todo - replace with svg
import xastroIcon from '../public/xastro.png';
import { addressState } from '../data/wallet';
import { useRecoilValue } from 'recoil';
import MyLockdropDepositsEmptyTableRow from './MyLockdropDepositsEmptyTableRow';
import { useLockdrop } from 'hooks/useLockdrop';
import { txState } from '../data/txState';

type Props = {};

const MyLockdropDepositsTable: FC<Props> = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));

  const userWalletAddr = useRecoilValue(addressState);
  const [loading, setLoading] = useState(true);
  const { queryUserLockdropInfo } = useLockdrop();
  const [lockdropRecords, setLockdropRecords] = useState([]);

  // tx state to trigger refresh of data
  const transactionState = useRecoilValue(txState);

  const getUserLockdropBalance = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getUserLockdropBalance();
      }
    })();
  }, [userWalletAddr, transactionState]);

  return (
    <WidgetContainer
      title="My Lockdrop Deposits"
      titleFontVariant="body2"
      padding={0}
      style={{ width: '100%' }}>
      {!isMobile && <MyLockdropDepositsHeader />}
      {!userWalletAddr && (
        <MyLockdropDepositsEmptyTableRow msg="You need to connect your wallet" />
      )}
      {userWalletAddr && lockdropRecords.length <= 0 && (
        <MyLockdropDepositsEmptyTableRow msg="You do not have any lockdrop deposits" />
      )}
      {userWalletAddr &&
        lockdropRecords.length > 0 &&
        lockdropRecords.map((deposit: any, i: number) => {
          const { amount, unlocksOn, rewards, duration, withdrawal_flag } =
            deposit;
          return (
            <MyLockdropDepositsRow
              key={'row-' + i}
              icon={xastroIcon}
              loading={loading}
              amount={amount / 1000000}
              unlocksOn={unlocksOn * 1000}
              rewards={rewards / 1000000}
              duration={duration}
              withdrawal_flag={withdrawal_flag}
              percentOfRewards={rewards / 1000000 / 5000000}
            />
          );
        })}
    </WidgetContainer>
  );
};

export default MyLockdropDepositsTable;
