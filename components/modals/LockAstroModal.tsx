import React, { FC, useCallback, useState, useEffect } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import Modal from 'components/modals/MuiModal';
import NumericalInput from 'components/NumericalInput';
import StyledSlider from 'components/StyledSlider';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  white95,
  almostBlack,
  gold,
  buttonGrey,
  red
} from '../../theme/mui-theme';
import { addressState } from '../../data/wallet';
import { useWallet } from '@terra-money/wallet-provider';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLockdrop } from 'hooks/useLockdrop';
import { snackBarState } from '../../data/snackBar';
import { execFile } from 'child_process';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TOTAL_APOLLO_REWARDS = 5000000;

const LockAstroModal: FC<Props> = ({ isOpen, onClose }) => {
  const [lockAmount, setLockAmount] = useState(0);
  const [lockPeriod, setLockPeriod] = useState(0);
  const [astroPrice, setAstroPrice] = useState(0);
  const [xAstroPrice, setXAstroPrice] = useState(0);
  const [depositTotal, setDepositTotal] = useState(0);
  const [xAstroBalance, setxAstroBalance] = useState(0);
  const [lockDisabledMessage, setLockDisabledMessage] = useState('');

  const setSnackBarState = useSetRecoilState(snackBarState);

  const lockDisabled =
    lockAmount <= 0 || lockPeriod <= 0 || lockAmount > xAstroBalance;

  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const userWalletAddr: any = useRecoilValue(addressState);
  const {
    executeDepositAsset,
    queryWalletxAstroBalance,
    queryUserLockdropInfo,
    queryTotalLockdropInfo,
    queryPrices
  } = useLockdrop();

  // handle lock amount update
  const updateLockAmount = (amount: number) => {
    setLockAmount(amount);
    setDepositTotal(amount * xAstroPrice);
  };

  // get the user's xAstro balance
  const getUserxAstroBalance = useCallback(async () => {
    try {
      const { balance } = await queryWalletxAstroBalance(userWalletAddr);
      setxAstroBalance(balance / 1000000);
    } catch (e) {
      setSnackBarState({
        severity: 'error',
        message: `Error getting user xAstro balance`,
        open: true
      });
      console.error(e);
    }
  }, []);

  // get token prices
  const getTokenPrices = useCallback(async () => {
    try {
      const { xastro, astro } = await queryPrices();
      setXAstroPrice(xastro);
      setAstroPrice(astro);
    } catch (e) {
      setSnackBarState({
        severity: 'error',
        message: `Error getting token prices`,
        open: true
      });
      console.error(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getUserxAstroBalance();
        getTokenPrices();
      }
    })();
  }, [userWalletAddr]);

  // call the contract to lock the xastro
  const handleLockxAstro = async () => {
    try {
      const response = await executeDepositAsset(
        'xastro',
        lockAmount * 1000000,
        lockPeriod
      );

      console.log('response', response);
      if (response.success) {
        setSnackBarState({
          severity: 'success',
          message: `xAstroDeposit complete! Hash: ${response.result.txhash}`,
          link: response.result.txhash,
          open: true
        });
      } else {
        throw new Error('xAstroDeposit failed');
      }
    } catch (e) {
      setSnackBarState({
        severity: 'error',
        message: `An error occured and the xAstroDeposit transaction was not completed.`,
        open: true
      });
      console.error(e);
    }
  };

  // todo - check the math here
  const percentageOfRewards = useCallback(() => {
    let multiplier = 1;
    if (lockPeriod >= 52) {
      multiplier = 6.9;
    } else if (lockPeriod >= 39) {
      multiplier = 4.2;
    } else if (lockPeriod >= 26) {
      multiplier = 2.4;
    }
    let rewards = (lockAmount * multiplier) / TOTAL_APOLLO_REWARDS;

    if (rewards < 0.0001) {
      return '< .01%';
    }

    return (rewards * 100).toFixed(2) + '%';
  }, [lockAmount, lockPeriod]);

  // todo - check the math here
  const apolloRewardsAmount = useCallback(() => {
    let multiplier = 1;

    if (lockPeriod >= 52) {
      multiplier = 6.9;
    } else if (lockPeriod >= 39) {
      multiplier = 4.2;
    } else if (lockPeriod >= 26) {
      multiplier = 2.4;
    }

    let rewards = lockAmount * multiplier;

    return rewards.toFixed(2);
  }, [lockAmount, lockPeriod]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box className="panel">
        <Box p="16px">
          <Box className="backIcon" onClick={onClose}>
            <ChevronLeftIcon fontSize={28} />
          </Box>
          <Box textAlign="center">
            <h6 className="color-primary obviouslyFont">Lock xASTRO</h6>
          </Box>
        </Box>
        <Box h={1} className="border" />
        <Box p="24px">
          <p className="color-secondary">
            Select how much xASTRO you want to deposit into Apollo’s xASTRO
            Lockdrop and how long you would like to lock it. Note that once
            Stage 2 begins (Day 6) you will not be able to make any xASTRO
            deposits into the Lockdrop.
          </p>
        </Box>
      </Box>
      <Box className="panel" mt="16px" p="24px">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <p className="color-primary">Lock Up</p>
          <p className="color-secondary">
            In wallet:{' '}
            <span
              className="color-link"
              style={{ cursor: 'pointer' }}
              onClick={() => updateLockAmount(xAstroBalance)}>
              {xAstroBalance}
            </span>
          </p>
        </Box>
        <Box
          py="8px"
          px="12px"
          mt="12px"
          display="flex"
          alignItems="center"
          className="panel1 bg-main">
          <Box display="flex" alignItems="center">
            <Image src="/xastro.png" width={30} />
            <Box ml="6px">
              <h5 className="color-primary">xASTRO</h5>
            </Box>
          </Box>
          <Box flex={1} textAlign="right">
            <NumericalInput
              value={lockAmount}
              onUserInput={(val: any) => {
                updateLockAmount(val);
              }}
            />
            <small className="color-secondary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(depositTotal)}
            </small>
          </Box>
        </Box>
        <Box mt="16px">
          <StyledSlider
            value={Number(lockAmount)}
            setValue={(val) => updateLockAmount(val)}
            maxValue={xAstroBalance}
            maxString="Max"
          />
        </Box>
      </Box>
      <Box className="panel" mt="16px" p="24px">
        <p className="color-primary">Lock Period</p>
        <Grid mt={0.5} container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <p className="color-secondary">
              The longer you lock, the more APOLLO rewards you will receive.
            </p>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="panel1" py="8px" px="12px">
              <Box display="flex" alignItems="center">
                <NumericalInput
                  placeholder=""
                  value={lockPeriod}
                  onUserInput={(val: any) => {
                    setLockPeriod(val);
                  }}
                />
                <Box ml="6px">
                  <h5 className="color-secondary">WEEKS</h5>
                </Box>
              </Box>

              {/* // todo - update date with weeks value
              <Box textAlign="right">
                <small className="color-secondary">August 1, 2012</small>
              </Box> */}
            </Box>
          </Grid>
        </Grid>
        <Box mt="16px">
          <StyledSlider
            value={Number(lockPeriod)}
            setValue={(val) => setLockPeriod(val)}
            maxValue={52}
            step={13}
            symbol="Weeks"
            // pointValues={['0 Months', '6 Months', '12 Months']}
          />
        </Box>
      </Box>
      <Grid container mt="16px" py="12px" px="24px" className="panel1 bg-main">
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <Image src="/apollo.png" width={20} />
            <Box ml="6px">
              <p className="color-primary">{apolloRewardsAmount()}</p>
            </Box>
          </Box>
          <small className="color-secondary">Est. APOLLO Rewards</small>
        </Grid>
        <Grid item container xs={12} sm={6}>
          {!isMobile && <Box width="1px" className="border" />}
          <Box mt={isMobile ? '12px' : 0} ml={isMobile ? 0 : '16px'}>
            <p className="color-primary">{percentageOfRewards()}</p>
            <small className="color-secondary">
              Est. % of Lockdrop Rewards
            </small>
          </Box>
        </Grid>
      </Grid>
      <Box textAlign="center" mt="16px">
        <Button
          maxWidth={156}
          width="100%"
          borderRadius={15}
          height={45}
          fontSize={13}
          fontFamily="Obviously, sans-serif"
          backgroundColor={lockDisabled ? buttonGrey : gold}
          color={almostBlack}
          sx={{
            '&:hover': {
              backgroundColor: lockDisabled ? buttonGrey : gold,
              color: white95
            }
          }}
          disabled={lockDisabled}
          onClick={handleLockxAstro}>
          Lock xASTRO
        </Button>
        {lockDisabledMessage && (
          <Box mt="8px" sx={{ color: red }}>
            {{ lockDisabledMessage }}
          </Box>
        )}
        <Box mt="8px">
          <small className="color-secondary">TX Fee: 0.25 UST</small>
        </Box>
      </Box>
    </Modal>
  );
};

export default LockAstroModal;
