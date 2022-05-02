import React, { FC, useCallback, useState, useEffect } from 'react';
import { useTheme, useMediaQuery, Grid, Skeleton, Box } from '@mui/material';
import WidgetContainer from './WidgetContainer';
import { white60, orangeGoldGradientHorz50 } from '../theme/mui-theme';
import ApolloLockdropStat from './ApolloLockdropStat';
import ApolloLockdropRewardsCard from './ApolloLockdropRewardsCard';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import ApolloFormattedStatistic from './ApolloFormattedStatistic';
import { addressState } from '../data/wallet';
import { useRecoilValue } from 'recoil';
import { useLockdrop } from 'hooks/useLockdrop';
import { txState } from '../data/txState';

type Props = {};

const useStyles: any = makeStyles((theme: Theme) => ({
  lighter: {
    color: white60
  },
  smaller: {
    fontSize: '1.0rem',
    fontWeight: 'normal'
  }
}));

const LockdropOverview: FC<Props> = ({}) => {
  const classes = useStyles();

  // user wallet address
  const userWalletAddr = useRecoilValue(addressState);
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));

  // component state
  const totalRewards = 5000000000000;
  const [totalDeposits, setTotalDeposits] = useState(0); // total amount of xastro deposits
  const [totalUserDeposits, setTotalUserDeposits] = useState(0); // total amount of xastro deposits by user
  const [totalUserRewards, setTotalUserRewards] = useState(0); // total amount of xastro rewards by user
  const [totalUserRewardsPercent, setTotalUserRewardsPercent] = useState(0); // total amount of xastro rewards by user

  const [loadingLockdropInfo, setLoadingLockdropInfo] = useState(true);
  const [loadingUserLockdropInfo, setLoadingUserLockdropInfo] = useState(true);

  // contract interaction methods
  const { queryUserLockdropInfo, queryTotalLockdropInfo } = useLockdrop();

  // tx state to trigger refresh of data
  const transactionState = useRecoilValue(txState);

  // fetch and set lockdrop totals
  const getLockdropTotal = useCallback(async () => {
    try {
      setLoadingLockdropInfo(true);
      const { total_amount_in_lockups } = await queryTotalLockdropInfo();
      setTotalDeposits(total_amount_in_lockups);
    } catch (e) {
      console.error(e);
    } finally {
      // setLoadingLockdropInfo(false);
    }
  }, []);

  // fetch and set user lockdrop totals
  const getUserLockdropTotal = useCallback(async () => {
    try {
      setLoadingUserLockdropInfo(true);
      const { total_apollo_rewards, lockup_infos } =
        await queryUserLockdropInfo(userWalletAddr);
      const userDeposits = lockup_infos.reduce(
        (acc, curr) => acc + parseInt(curr.units_locked),
        0
      );
      setTotalUserDeposits(userDeposits);
      setTotalUserRewards(total_apollo_rewards);
      setTotalUserRewardsPercent(total_apollo_rewards / totalRewards);
    } catch (e) {
      console.error(e);
    } finally {
      // setLoadingUserLockdropInfo(false);
    }
  }, []);

  // initial state regardless of connection
  useEffect(() => {
    (async () => {
      getLockdropTotal();
    })();
  }, [totalDeposits, transactionState]);

  // initial state if user is connected
  useEffect(() => {
    (async () => {
      if (userWalletAddr && totalDeposits) {
        getUserLockdropTotal();
      }
    })();
  }, [userWalletAddr, totalDeposits, transactionState]);

  return (
    <WidgetContainer
      title="xASTRO Lockdrop"
      titleFontVariant="body2"
      padding={0}
      linkText="Learn More"
      linkUrl="https://articles.apollo.farm/the-apollo-xastro-lockdrop/"
      style={{ width: '100%' }}>
      <Grid
        container
        p={5}
        spacing={4}
        justifyContent="center"
        alignItems="center">
        <Grid item md={4} xs={12} textAlign="center" justifyContent="center">
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <ApolloLockdropStat
                titleContent={
                  loadingLockdropInfo ? (
                    <Skeleton variant="text" width="70%" />
                  ) : (
                    <ApolloFormattedStatistic
                      value={5000000}
                      fontSize="26px"
                      postFix={'APOLLO'}
                    />
                  )
                }
                subtitle={'Total Lockdrop Rewards'}
                textAlign={isMobile ? 'center' : 'left'}
              />
            </Grid>
            <Grid item>
              <ApolloLockdropStat
                titleContent={
                  loadingLockdropInfo ? (
                    <Skeleton variant="text" width="70%" />
                  ) : (
                    <ApolloFormattedStatistic
                      value={totalUserRewardsPercent}
                      decimals={2}
                      percentage={true}
                      fontSize="26px"
                    />
                  )
                }
                subtitle={'My Est. % of Lockdrop Rewards'}
                textAlign={isMobile ? 'center' : 'left'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12} textAlign="center" alignItems="center">
          <ApolloLockdropRewardsCard
            loading={loadingLockdropInfo}
            amount={totalUserRewards / 1000000}
          />
        </Grid>
        <Grid item md={4} xs={12} textAlign="right">
          <Grid container direction="column" spacing={4}>
            <Grid item textAlign={'right'}>
              <ApolloLockdropStat
                titleContent={
                  loadingLockdropInfo ? (
                    <Box
                      sx={{
                        width: '100%',
                        textAlign: 'right'
                      }}>
                      <Skeleton
                        variant="text"
                        width="70%"
                        sx={{ display: 'inline-block' }}
                      />
                    </Box>
                  ) : (
                    <ApolloFormattedStatistic
                      value={totalDeposits / 1000000}
                      decimals={2}
                      decimalsInGrey={true}
                      postFix={'xASTRO'}
                      fontSize="26px"
                    />
                  )
                }
                subtitle={'Total Deposits in Lockdrop'}
                textAlign={isMobile ? 'center' : 'right'}
              />
            </Grid>
            <Grid item>
              <ApolloLockdropStat
                titleContent={
                  loadingLockdropInfo ? (
                    <Box
                      sx={{
                        width: '100%',
                        textAlign: 'right'
                      }}>
                      <Skeleton
                        variant="text"
                        width="70%"
                        sx={{ display: 'inline-block' }}
                      />
                    </Box>
                  ) : (
                    <ApolloFormattedStatistic
                      value={totalUserDeposits / 1000000}
                      decimals={2}
                      decimalsInGrey={true}
                      postFix={'xASTRO'}
                      fontSize="26px"
                    />
                  )
                }
                subtitle={'My Total Deposits in Lockdrop'}
                textAlign={isMobile ? 'center' : 'right'}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </WidgetContainer>
  );
};

export default LockdropOverview;
