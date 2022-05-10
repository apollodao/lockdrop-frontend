import React, { FC, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import ApolloCardHeader from './ApolloCardHeader';
import ApolloCardBody from './ApolloCardBody';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import Grid from '@mui/material/Grid';
import {
  borderGrey,
  buttonGrey,
  white5,
  white60,
  white95
} from '../theme/mui-theme';
import apolloIcon from '../public/apollo.svg';
import Button from './Button';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import ApolloFormattedStatistic from './ApolloFormattedStatistic';
import WithdrawAstroModal from 'components/modals/WithdrawAstroModal';
import Skeleton from '@mui/material/Skeleton';

type Props = {
  icon: any;
  loading: boolean;
  amount: number;
  unlocksOn: number;
  rewards: number;
  duration: number;
  withdrawal_flag: boolean;
  percentOfRewards: number;
};

const MyLockdropDepositsRow: FC<Props> = ({
  icon,
  loading,
  amount,
  unlocksOn,
  rewards,
  duration,
  withdrawal_flag,
  percentOfRewards
}: Props) => {
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));

  const handleWithdraw = () => {
    setOpenWithdrawModal(true);
  };

  const daysUntilUnlock = Math.round(
    (new Date(unlocksOn).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <Grid
      container
      justifyContent="flex-start"
      alignItems={isMobile ? 'flex-start' : 'center'}
      direction="row"
      sx={{
        color: white95,
        fontSize: '15px',
        p: 3,
        lineHeight: '20px',
        borderBottom: '1px solid',
        borderColor: borderGrey,
        '&:hover': {
          backgroundColor: white5
        },
        '&:last-of-type': {
          borderBottom: 'none'
        },
        '&:hover&:last-of-type': {
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px'
        }
      }}>
      {openWithdrawModal && (
        <WithdrawAstroModal
          amount={amount}
          unlocksOn={unlocksOn}
          rewards={rewards}
          duration={duration}
          percentOfRewards={percentOfRewards}
          isOpen={openWithdrawModal}
          onClose={() => setOpenWithdrawModal(false)}
        />
      )}
      {isMobile && (
        <Grid item xs={6} sm={6} mb={2}>
          xASTRO Locked
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={2}
        mb={isMobile ? 2 : 0}
        container
        justifyContent={isMobile ? 'flex-end' : 'flex-start'}>
        {loading ? (
          <Skeleton variant="text" width="70%" />
        ) : (
          <>
            {' '}
            <Grid item sx={{ marginRight: '8px' }}>
              <Image src={icon} width={20} height={20} alt="xAstro Icon" />
            </Grid>
            <Grid item>
              <ApolloFormattedStatistic
                value={amount}
                decimals={2}
                fontSize="15px"
                decimalsInGrey={true}
              />
            </Grid>
          </>
        )}
      </Grid>
      {isMobile && (
        <Grid item xs={6} sm={6}>
          Fully Unlocks On
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={2}
        mb={isMobile ? 2 : 0}
        textAlign={isMobile ? 'right' : 'left'}>
        {loading ? (
          <Skeleton variant="text" width="70%" />
        ) : (
          <>
            <div style={{ marginBottom: '4px' }}>
              {new Date(unlocksOn).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
              })}
            </div>
            <Typography
              sx={{ fontSize: '14px', fontWeight: 400 }}
              color={white60}>
              {daysUntilUnlock} days
            </Typography>
          </>
        )}
      </Grid>
      {isMobile && (
        <Grid item xs={6} sm={6}>
          Est. APOLLO Rewards
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        mb={isMobile ? 2 : 0}
        container
        justifyContent={isMobile ? 'flex-end' : 'flex-start'}>
        {loading ? (
          <Skeleton variant="text" width="70%" />
        ) : (
          <>
            <Grid item sx={{ marginRight: '8px' }}>
              <Image
                src={apolloIcon}
                width={20}
                height={20}
                alt="Apollo Icon"
              />
            </Grid>
            <Grid item>
              <ApolloFormattedStatistic
                value={rewards}
                decimals={2}
                fontSize="15px"
                decimalsInGrey={true}
              />
            </Grid>
          </>
        )}
      </Grid>
      {isMobile && (
        <Grid item xs={6} sm={6}>
          Est. % of Lockdrop Rewards
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        mb={isMobile ? 2 : 0}
        textAlign={isMobile ? 'right' : 'left'}>
        {loading ? (
          <Skeleton variant="text" width="70%" />
        ) : (
          <>
            {percentOfRewards.toLocaleString(undefined, {
              style: 'percent',
              minimumFractionDigits: 2
            })}
          </>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={2} textAlign="right">
        {loading ? (
          <Skeleton
            variant="text"
            width="70%"
            sx={{ display: 'inline-block' }}
          />
        ) : (
          <Button
            style={{
              '&:disabled': {
                color: white60,
                backgroundColor: buttonGrey,
                cursor: 'not-allowed'
              }
            }}
            label="Withdraw"
            disabled={true}
            onClick={handleWithdraw}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default MyLockdropDepositsRow;
