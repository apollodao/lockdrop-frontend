import React, { FC, useCallback, useState, useEffect } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';
import { Grid, useTheme, useMediaQuery } from '@mui/material';
import Modal from 'components/modals/MuiModal';
import NumericalInput from 'components/NumericalInput';
import StyledSlider from 'components/StyledSlider';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { white95, almostBlack, gold, buttonGrey } from '../../theme/mui-theme';
import { addressState } from '../../data/wallet';
import { useWallet } from '@terra-money/wallet-provider';
import { useRecoilValue } from 'recoil';
import { useLockdrop } from 'hooks/useLockdrop';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TOTAL_APOLLO_REWARDS = 5000000;

const LockAstroModal: FC<Props> = ({ isOpen, onClose }) => {
  const [lockAmount, setLockAmount] = useState(0);
  const [lockPeriod, setLockPeriod] = useState(0);
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const userWalletAddr: any = useRecoilValue(addressState);
  const { queryWalletxAstroBalance, executeDepositAsset } = useLockdrop();
  const [xAstroBalance, setxAstroBalance] = useState(0);

  // TODO - get current xAstro token price

  const getUserxAstroBalance = useCallback(async () => {
    try {
      const { balance } = await queryWalletxAstroBalance(userWalletAddr);
      setxAstroBalance(balance / 1000000);
      console.log('balance', balance);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getUserxAstroBalance();
      }
    })();
  }, [userWalletAddr]);

  // call the contract to lock the xastro
  const handleLockxAstro = async () => {
    try {
      const result = await executeDepositAsset(lockAmount, lockPeriod);
      // todo - set loading state
    } catch (e) {
      console.error(e);
    }
  };

  const handleParamsChange = useCallback(() => {
    console.log('lockAmount', lockAmount);
    console.log('lockPeriod', lockPeriod);
  }, [lockAmount, lockPeriod]);

  const handleLockupDurationChange = (val: any) => {
    // setLockPeriod(val.toString()
  };

  // todo - check the math here
  const percentageOfRewards = useCallback(() => {
    let multiplier = 1;
    if (lockPeriod >= 6) {
      multiplier = 2.4;
    } else if (lockPeriod >= 9) {
      multiplier = 4.2;
    } else if (lockPeriod >= 12) {
      multiplier = 6.9;
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
    if (lockPeriod >= 6) {
      multiplier = 2.4;
    } else if (lockPeriod >= 9) {
      multiplier = 4.2;
    } else if (lockPeriod >= 12) {
      multiplier = 6.9;
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
        <Box h={1} className="border"></Box>
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
            In wallet: <span className="color-link">{xAstroBalance}</span>
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
                setLockAmount(val);
              }}
            />
            <small className="color-secondary">$4,375.00</small>
          </Box>
        </Box>
        <Box mt="16px">
          <StyledSlider
            value={Number(lockAmount)}
            setValue={(val) => setLockAmount(val)}
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
                  <h5 className="color-secondary">MONTHS</h5>
                </Box>
              </Box>
              <Box textAlign="right">
                <small className="color-secondary">August 1, 2012</small>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt="16px">
          <StyledSlider
            value={Number(lockPeriod)}
            setValue={(val) => setLockPeriod(val)}
            maxValue={12}
            pointValues={['0 Months', '6 Months', '12 Months']}
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
          backgroundColor={gold}
          color={almostBlack}
          backgroundHoverColor={buttonGrey}
          hoverColor={white95}
          onClick={handleLockxAstro}>
          Lock xASTRO
        </Button>
        <Box mt="8px">
          <small className="color-secondary">TX Fee: 0.25 UST</small>
        </Box>
      </Box>
    </Modal>
  );
};

export default LockAstroModal;
