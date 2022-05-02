import React from 'react';
import dayjs from 'dayjs';

import { useAstroApp } from 'modules/common';

import LaunchTimeline from 'components/LaunchTimeline';
import Phase2Bootstrap from 'components/Phase2Bootstrap';
import AddLiquidity from 'components/AddLiquidity';
import AstroAirdrop from 'components/AstroAirdrop';
import Table from 'components/Table';
import Card from 'components/Card';
import LockdropPageHeader from 'components/LockdropPageHeader';
import LockdropOverview from 'components/LockdropOverview';
import MyxAstroTable from 'components/MyxAstroTable';
import MyLockdropDepositsTable from 'components/MyLockdropDepositsTable';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { snackBarState } from '../../data/snackBar';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '@mui/material/Button';
import networks, {
  isSupportedNetwork,
  SupportedNetwork
} from '../../store/networks';
import { networkNameState } from '../../data/network';
import { white95 } from 'theme/mui-theme';
import AlertTitle from '@mui/material/AlertTitle';

const Phase2 = () => {
  const { open, message, severity, link } = useRecoilValue(snackBarState);
  const setSnackBarState = useSetRecoilState(snackBarState);

  let networkName = useRecoilValue(networkNameState);
  if (!networkName || !isSupportedNetwork(networkName)) {
    networkName = 'mainnet';
  }

  return (
    <Container>
      <Stack direction="column" spacing={8} mt={8} mb={8}>
        <LockdropPageHeader />
        <LockdropOverview />
        <MyxAstroTable />
        <MyLockdropDepositsTable />
        <Snackbar
          open={open}
          onClose={() => setSnackBarState({ open: false, severity, message })}>
          <Alert
            severity={severity}
            variant={'filled'}
            sx={{
              fontSize: '14px',
              fontWeight: '400'
            }}
            action={
              link && (
                <Button
                  size={'small'}
                  sx={{
                    color: white95,
                    padding: '12px',
                    height: '24px'
                  }}
                  href={`https://finder.extraterrestrial.money/${networkName}/tx/${link}`}
                  target={'_blank'}>
                  View On Finder
                </Button>
              )
            }>
            {message}
          </Alert>
        </Snackbar>
        ;
      </Stack>
    </Container>
  );
};

export default Phase2;
