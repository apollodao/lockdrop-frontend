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
import { snackBarState } from '../../data/Snackbar';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '@mui/material/Button';

const Phase2 = () => {
  const { open, message, severity, link } = useRecoilValue(snackBarState);
  const setSnackBarState = useSetRecoilState(snackBarState);

  return (
    <Container>
      <Stack direction="column" spacing={8} mt={8}>
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
            action={
              link && (
                <Button size={'small'} href={`#`} target={'_blank'}>
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
