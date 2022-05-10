import React, { FC, ReactNode } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { white95, white60, almostBlack } from '../theme/mui-theme';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ApolloCountdown from './ApolloCountdown';
import ApolloStageIndicator from './ApolloStageIndicator';

type Props = {};

const LockdropPageHeader: FC<Props> = ({}) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));

  return (
    <Grid container direction="row" spacing={2}>
      <Grid
        item
        lg={4}
        md={4}
        xs={12}
        sm={12}
        textAlign={isMobile ? 'center' : 'left'}>
        <Typography variant="subtitle1" sx={{ mb: '10px' }}>
          ENDED
        </Typography>
        <Typography variant="body1" color={white60}>
          The Apollo xAstro Lockdrop is now closed, thank you for all the
          support. You will be able to claim your Apollo rewards on this page
          and in the Rewards tab. Once your Lock Period ends, you will be able
          to claim your apAstro in return for the deposited xAstro.
        </Typography>
      </Grid>
      <Grid item lg={4} md={4} xs={12} sm={12} textAlign="center">
        <ApolloCountdown />
      </Grid>
      <Grid item lg={4} md={4} xs={12} sm={12}>
        <ApolloStageIndicator borderColor={almostBlack} />
      </Grid>
    </Grid>
  );
};

export default LockdropPageHeader;
