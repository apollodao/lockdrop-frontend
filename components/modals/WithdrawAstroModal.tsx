import React, { FC, useCallback, useState, useEffect } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';
import { Grid, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import Modal from 'components/modals/MuiModal';
import NumericalInput from 'components/NumericalInput';
import StyledSlider from 'components/StyledSlider';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { white95, almostBlack, gold, buttonGrey } from '../../theme/mui-theme';
import { addressState } from '../../data/wallet';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLockdrop } from 'hooks/useLockdrop';
import { snackBarState } from '../../data/snackBar';
import { networkNameState, lcdClientQuery } from '../../data/network';
import { isSupportedNetwork } from '../../store/networks';
import { poll } from 'poll';

type Props = {
  amount: number;
  unlocksOn: number;
  rewards: number;
  duration: number;
  percentOfRewards: number;
  isOpen: boolean;
  onClose: () => void;
};

const WithdrawAstroModal: FC<Props> = ({
  amount,
  unlocksOn,
  rewards,
  duration,
  isOpen,
  onClose
}) => {
  let networkName: any = useRecoilValue(networkNameState);
  if (!networkName || !isSupportedNetwork(networkName)) {
    networkName = 'mainnet';
  }
  const lcdClient = useRecoilValue(lcdClientQuery);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [xAstroPrice, setXAstroPrice] = useState(0);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const { queryPrices, executeWithdrawAsset } = useLockdrop();
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const userWalletAddr: any = useRecoilValue(addressState);
  const [pollingTransactionHash, setPollingTransactionHash] = useState('');

  const setSnackBarState = useSetRecoilState(snackBarState);

  const withdrawDisabled = Number(withdrawAmount) <= 0;

  // handle withdraw amount update
  const updateWithdrawAmount = (amount: number) => {
    setWithdrawAmount(amount);
    setWithdrawValue(amount * xAstroPrice);
  };

  // get token prices
  const getTokenPrices = useCallback(async () => {
    try {
      const { xastro } = await queryPrices();
      setXAstroPrice(xastro);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // call the contract to withdraw the xastro
  const handleWithdrawXAstro = async () => {
    try {
      const response = await executeWithdrawAsset(
        duration,
        Math.round(withdrawAmount * 1000000)
      );
      if (response.success) {
        setPollingTransactionHash(response.result.txhash);

        let stopPolling = false;
        const shouldStopPolling = () => stopPolling;
        const pollForWithdrawComplete = () => {
          lcdClient.tx
            .txInfo(response.result.txhash)
            .then((result: any) => {
              console.log('it worked', result);
              stopPolling = true;
              if (result.raw_log.indexOf('failed') >= 0) {
                setSnackBarState({
                  severity: 'error',
                  message: `xAstro Withdraw error: ${result.raw_log}`,
                  link: response.result.txhash,
                  open: true
                });
              } else {
                setSnackBarState({
                  severity: 'success',
                  message: `xAstro Withdraw completed successfully!`,
                  link: response.result.txhash,
                  open: true
                });
              }
              onClose();
            })
            .catch((result: any) => {
              console.log(result);
            });
        };

        poll(pollForWithdrawComplete, 1000, shouldStopPolling);
      } else {
        throw new Error('xAstroDeposit failed');
      }
    } catch (e) {
      setSnackBarState({
        severity: 'error',
        message: `An error occured and the xAstroDeposit withdraw was not completed.`,
        open: true
      });
      console.error(e);
    }
  };

  // set state effect
  useEffect(() => {
    (async () => {
      if (userWalletAddr) {
        getTokenPrices();
      }
    })();
  }, [userWalletAddr]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {pollingTransactionHash ? (
        <Box className="panel">
          <Box p="16px">
            <Box className="backIcon" onClick={onClose}>
              <ChevronLeftIcon fontSize={28} />
            </Box>
            <Box textAlign="center">
              <h6 className="color-primary obviouslyFont">
                Waiting for Transaction
              </h6>
            </Box>
          </Box>
          <Box h={1} className="border" />
          <Box p="32px" textAlign={'center'}>
            <CircularProgress color="warning" />
            <Box sx={{ marginBottom: '20px' }} className="color-secondary">
              Your Transaction:
            </Box>
            <Box sx={{ marginBottom: '20px' }} className="color-primary">
              {pollingTransactionHash}
            </Box>
            <Box sx={{ marginBottom: '20px' }} className="color-secondary">
              has been submitted and is being processed. Please stand by for
              transaction confirmation. You will be redirected automatically
              once complete.
            </Box>
            <Button
              maxWidth={156}
              width="100%"
              borderRadius={10}
              height={45}
              fontSize={'13px'}
              fontFamily="Obviously, sans-serif"
              backgroundColor={gold}
              color={almostBlack}
              sx={{
                '&:hover': {
                  backgroundColor: buttonGrey,
                  color: white95
                }
              }}
              onClick={() => {
                window.open(
                  `https://finder.extraterrestrial.money/${networkName}/tx/${pollingTransactionHash}`,
                  '_blank'
                );
              }}>
              View on Finder
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box className="panel">
            <Box p="16px">
              <Box className="backIcon" onClick={onClose}>
                <ChevronLeftIcon fontSize={28} />
              </Box>
              <Box textAlign="center">
                <h6 className="color-primary obviouslyFont">Withdraw xASTRO</h6>
              </Box>
            </Box>
            <Box h={1} className="border" />
            <Box p="16px">
              <p className="color-secondary">
                Select how much xASTRO you want to withdraw from Apollo’s xASTRO
                Lockdrop. Starting from day 6, you will only be able to withdraw
                up to 50% of your xASTRO deposits. On day 7, withdrawal
                allowance will fall linearly from 50% to 0%.
              </p>
            </Box>
          </Box>
          <Box className="panel" mt="16px" p="16px">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              <p className="color-primary">Withdraw</p>
              <p className="color-secondary">
                Withdrawable:{' '}
                <span
                  className="color-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => updateWithdrawAmount(amount)}>
                  {amount}
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
                  value={withdrawAmount}
                  onUserInput={(val: any) => {
                    updateWithdrawAmount(val);
                  }}
                />
                <small className="color-secondary">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(withdrawValue)}
                </small>
              </Box>
            </Box>
            <Box mt="16px">
              <StyledSlider
                value={Number(withdrawAmount)}
                setValue={(val) => updateWithdrawAmount(val)}
                maxValue={amount}
                maxString="Max"
              />
            </Box>
          </Box>
          <Box className="panel" mt="16px" p="16px">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <p className="color-primary">Lock Period</p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="panel1" py="8px" px="12px">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end">
                    <h2 className="color-primary">{duration}</h2>
                    <Box ml="6px">
                      <h5 className="color-secondary">WEEKS</h5>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <small className="color-secondary">
                      {' '}
                      {new Date(unlocksOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </small>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid
            container
            mt="16px"
            py="12px"
            px="16px"
            className="panel1 bg-main">
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Image src="/apollo.png" width={20} />
                <Box ml="6px">
                  <p className="color-primary">{rewards.toFixed(3)}</p>
                </Box>
              </Box>
              <small className="color-secondary">Est. APOLLO Rewards</small>
            </Grid>
            <Grid item container xs={12} sm={6}>
              {!isMobile && <Box width="1px" className="border" />}
              <Box mt={isMobile ? '12px' : 0} ml={isMobile ? 0 : '16px'}>
                <p className="color-primary">
                  {((rewards / 5000000) * 100).toFixed(2) + '%'}
                </p>
                <small className="color-secondary">
                  Est. % of Lockdrop Rewards
                </small>
              </Box>
            </Grid>
          </Grid>
          <Box textAlign="center" mt="16px">
            <Button
              maxWidth={192}
              width="100%"
              borderRadius={15}
              height={45}
              fontSize={13}
              fontFamily="Obviously, sans-serif"
              backgroundColor={withdrawDisabled ? buttonGrey : gold}
              disabled={withdrawDisabled}
              color={almostBlack}
              onClick={handleWithdrawXAstro}
              sx={{
                '&:hover': {
                  color: white95,
                  backgroundColor: buttonGrey
                }
              }}>
              Withdraw xASTRO
            </Button>
          </Box>
        </>
      )}
    </Modal>
  );
};

export default WithdrawAstroModal;
