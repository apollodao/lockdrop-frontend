import React, { FC, useEffect, useState, useCallback } from 'react';
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
  white5
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

type Props = {};

const MyxAstroTableRow: FC<Props> = ({}: Props) => {
  const [openLockModal, setOpenLockModal] = useState(false);
  const [openLockSuccessModal, setOpenLockSuccessModal] = useState(false);
  const [xAstroBalance, setxAstroBalance] = useState(0);
  const [lockdropBalance, setLockdropBalance] = useState(0);

  // tx state to trigger refresh of data
  const transactionState = useRecoilValue(txState);

  const handleLockxAstro = () => {
    setOpenLockModal(true);
  };

  const userWalletAddr: any = useRecoilValue(addressState);
  const { queryWalletxAstroBalance, queryUserLockdropInfo } = useLockdrop();

  const getUserxAstroBalance = useCallback(async () => {
    try {
      const { balance } = await queryWalletxAstroBalance(userWalletAddr);
      setxAstroBalance(balance / 1000000);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getUserLockdropBalance = useCallback(async () => {
    try {
      const userInfo = await queryUserLockdropInfo(userWalletAddr);
      const { lockup_infos } = userInfo;

      const lockdropBalance = lockup_infos.reduce(
        (acc, curr) => acc + parseInt(curr.units_locked),
        0
      );
      setLockdropBalance(lockdropBalance);
    } catch (e) {
      console.error(e);
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
      <Grid item md container direction="row" justifyContent="flex-start">
        <Grid item sx={{ marginRight: '8px' }}>
          <Image src={xastroIcon} width={20} height={20} alt="xAstro Icon" />
        </Grid>
        <Grid item>
          <Typography
            sx={{ fontSize: '15px', fontWeight: 500 }}
            color={white95}>
            xAstro
          </Typography>
        </Grid>
      </Grid>
      <Grid item md>
        <ApolloFormattedStatistic
          value={lockdropBalance / 1000000}
          decimals={2}
          decimalsInGrey={true}
        />
      </Grid>
      <Grid item md>
        <ApolloFormattedStatistic
          value={xAstroBalance}
          decimals={2}
          decimalsInGrey={true}
        />
      </Grid>
      <Grid item md={4} textAlign="right">
        <Button
          backgroundColor={gold}
          color={almostBlack}
          label="Lock xASTRO"
          onClick={handleLockxAstro}
        />
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
