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
import AstroWarsTrackerRow from './AstroWarsTrackerRow';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

type Props = {};

const data = [
  {
    name: 'Apollo',
    amount: 40000000000
  },
  {
    name: 'Reactor',
    amount: 10000000000
  },
  {
    name: 'Retrograde',
    amount: 30000000000
  }
];

const AstroWarsTrackerBody: FC<Props> = ({}) => {
  const { queryAllLockdrops } = useLockdrop();
  const [lockdropBalances, setLockdropBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [max, setMax] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const rows = await queryAllLockdrops();
        setLockdropBalances(
          rows.sort((a, b) => b.amount.balance - a.amount.balance)
        );
        setMax(
          Math.max.apply(
            null,
            rows.map((r) => parseInt(r.amount.balance / 1000000), 10)
          )
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = data.reduce((acc, cur) => acc + cur.amount, 0);

  // get data
  return loading
    ? new Array(3).map((item, index) => {
        return (
          <Grid
            key={'skele-' + index}
            container
            direction="column"
            justifyContent="center"
            sx={{ padding: '12px 24px' }}>
            <Grid item>
              <Skeleton variant="text" width="100%" height={24} />
            </Grid>
          </Grid>
        );
      })
    : lockdropBalances.map((item, index) => {
        return (
          <AstroWarsTrackerRow
            key={'tracker-' + index}
            name={item.name}
            amount={item.amount.balance}
            max={max}
            total={total}
          />
        );
      });
};

export default AstroWarsTrackerBody;
