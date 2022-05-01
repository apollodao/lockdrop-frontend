import React, { FC, ReactNode } from 'react';
import { white95, white60, almostBlack } from '../theme/mui-theme';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ApolloCountdown from './ApolloCountdown';
import ApolloStageIndicator from './ApolloStageIndicator';

type Props = {};

const LockdropPageHeader: FC<Props> = ({}) => {
  return (
    <Grid container direction="row" spacing={0}>
      <Grid item lg={4} md={4} xs={4}>
        <Typography variant="subtitle1" sx={{ mb: '10px' }}>
          STAGE I
        </Typography>
        <Typography variant="body1" color={white60}>
          During Stage 1 (Day 1-5) there are no limits on deposits and
          withdrawals of xASTRO. Once Stage 2 (Day 6) begins yo uwill only be
          able to withdraw xASTRO.
        </Typography>
      </Grid>
      <Grid item lg={4} md={4} xs={4} textAlign="center">
        <ApolloCountdown />
      </Grid>
      <Grid item lg={4} md={4} xs={4}>
        <ApolloStageIndicator borderColor={almostBlack} />
      </Grid>
    </Grid>
  );
};

export default LockdropPageHeader;
