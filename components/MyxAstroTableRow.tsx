import React, { FC, useEffect, useState, useCallback } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import ApolloCardHeader from './ApolloCardHeader';
import ApolloCardBody from './ApolloCardBody';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import Grid from '@mui/material/Grid';
import {
  white95,
  almostBlack,
  gold,
  buttonGrey,
  borderGrey,
  white5,
  white60
} from '../theme/mui-theme';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Button from './Button';
import ApolloFormattedStatistic from './ApolloFormattedStatistic';
import LockAstroModal from 'components/modals/LockAstroModal';
import LockSuccessModal from 'components/modals/LockSuccessModal';
import { useLockdrop } from 'hooks/useLockdrop';
import { addressState } from '../data/wallet';
import { useRecoilValue } from 'recoil';
import xastroIcon from '../public/xastro.png';
import { txState } from '../data/txState';
import Skeleton from '@mui/material/Skeleton';
import { lockdropConfig } from '../data/lockdropConfig';

type Props = {};

const MyxAstroTableRow: FC<Props> = ({}: Props) => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));
  const config = useRecoilValue(lockdropConfig);

  const [openLockModal, setOpenLockModal] = useState(false);
  const [openLockSuccessModal, setOpenLockSuccessModal] = useState(false);
  const [xAstroBalance, setxAstroBalance] = useState(0);
  const [lockdropBalance, setLockdropBalance] = useState(0);
  const [loadingAstroBalance, setLoadingAstroBalance] = useState(true);
  const [loadingLockdropBalance, setLoadingLockdropBalance] = useState(true);

  // tx state to trigger refresh of data
  const transactionState = useRecoilValue(txState);

  const handleLockxAstro = () => {
    setOpenLockModal(true);
  };

  const userWalletAddr: any = useRecoilValue(addressState);
  const { queryWalletxAstroBalance, queryUserLockdropInfo } = useLockdrop();

  const getUserxAstroBalance = useCallback(async () => {
    try {
      setLoadingAstroBalance(true);
      const { balance } = await queryWalletxAstroBalance(userWalletAddr);
      setxAstroBalance(balance / 1000000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAstroBalance(false);
    }
  }, []);

  const getUserLockdropBalance = useCallback(async () => {
    try {
      setLoadingLockdropBalance(true);
      const userInfo = await queryUserLockdropInfo(userWalletAddr);
      const { lockup_infos } = userInfo;
      const newLockdropBalance = lockup_infos.reduce(
        (acc, curr) => acc + parseInt(curr.units_locked),
        0
      );
      setLockdropBalance(newLockdropBalance);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLockdropBalance(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getUserxAstroBalance();
        getUserLockdropBalance();
      }
    })();
  }, [userWalletAddr, transactionState]);

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      sx={{
        p: 3,
        color: white95,
        fontSize: '15px',
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
      {openLockModal && (
        <LockAstroModal
          isOpen={openLockModal}
          onClose={() => setOpenLockModal(false)}
        />
      )}
      {openLockSuccessModal && (
        <LockSuccessModal
          isOpen={openLockSuccessModal}
          onClose={() => setOpenLockSuccessModal(false)}
        />
      )}
      {isMobile && (
        <Grid item xs={6}>
          Asset
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        lg={3}
        mb={isMobile ? 2 : 0}
        container
        justifyContent={isMobile ? 'flex-end' : 'flex-start'}>
        {loadingLockdropBalance ? (
          <Skeleton
            variant="text"
            width="70%"
            sx={{ display: 'inline-block' }}
          />
        ) : (
          <>
            <Grid item sx={{ marginRight: '8px' }}>
              <Image
                src={xastroIcon}
                width={20}
                height={20}
                alt="xAstro Icon"
              />
            </Grid>
            <Grid item>
              <Typography
                sx={{ fontSize: '15px', fontWeight: 500 }}
                color={white95}>
                xAstro
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
      {isMobile && (
        <Grid item xs={6}>
          In Lockdrop
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        lg={3}
        mb={isMobile ? 2 : 0}
        textAlign={isMobile ? 'right' : 'left'}>
        {loadingLockdropBalance ? (
          <Skeleton
            variant="text"
            width="70%"
            sx={{ display: 'inline-block' }}
          />
        ) : (
          <ApolloFormattedStatistic
            value={lockdropBalance / 1000000}
            decimals={2}
            decimalsInGrey={true}
          />
        )}
      </Grid>
      {isMobile && (
        <Grid item xs={6}>
          In Wallet
        </Grid>
      )}
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        lg={3}
        mb={isMobile ? 2 : 0}
        textAlign={isMobile ? 'right' : 'left'}>
        {loadingAstroBalance ? (
          <Skeleton
            variant="text"
            width="70%"
            sx={{ display: 'inline-block' }}
          />
        ) : (
          <ApolloFormattedStatistic
            value={xAstroBalance}
            decimals={2}
            decimalsInGrey={true}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={3} textAlign="right">
        {loadingLockdropBalance ? (
          <Skeleton
            variant="text"
            width="70%"
            sx={{ display: 'inline-block' }}
          />
        ) : (
          <Button
            backgroundColor={gold}
            color={almostBlack}
            disabled={config!.currentStage !== 'stage1'}
            label="Lock xASTRO"
            style={{
              '&:disabled': {
                color: white60,
                backgroundColor: buttonGrey,
                cursor: 'not-allowed'
              }
            }}
            onClick={handleLockxAstro}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default MyxAstroTableRow;
function queryUserLockdropInfo(
  userWalletAddr: any
): { balance: any } | PromiseLike<{ balance: any }> {
  throw new Error('Function not implemented.');
}
