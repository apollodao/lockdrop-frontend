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
import Grid from '@mui/material/Grid';
import { orangeGoldGradientHorz, white95 } from '../theme/mui-theme';
import Typography from '@mui/material/Typography';

type Props = {
  name: string;
  amount: number;
  total: number;
  max: number;
};

const AstroWarsTrackerBody: FC<Props> = ({ name, amount, total, max }) => {
  console.log('name', name, amount, max);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      sx={{ padding: '12px 24px' }}>
      <Grid item xs={2}>
        <Typography variant="body2" color={white95}>
          {name} ({Math.round(amount / 1000000)} xAstro)
        </Typography>
      </Grid>
      <Grid item xs={10} textAlign="left">
        <Grid
          sx={{
            display: 'inline-block',
            width: (Math.round(amount / 1000000) / max) * 100 + '%',
            height: '20px',
            background: orangeGoldGradientHorz
          }}></Grid>
      </Grid>
    </Grid>
  );
};

export default AstroWarsTrackerBody;
