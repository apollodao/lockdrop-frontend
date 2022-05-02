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
import { txState } from '../data/txState';
import AstroWarsTrackerBody from './AstroWarsTrackerBody';

type Props = {};

const AstroWarsTracker: FC<Props> = () => {
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
      title="Astro Wars Tracker"
      titleFontVariant="body2"
      padding={0}
      style={{ width: '100%' }}>
      <AstroWarsTrackerBody />
    </WidgetContainer>
  );
};

export default AstroWarsTracker;
