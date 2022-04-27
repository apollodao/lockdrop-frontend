import React, { FC, ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  Spacer,
  Stack,
  VStack
} from '@chakra-ui/react';
import ApolloCardHeader from './ApolloCardHeader';
import ApolloCardBody from './ApolloCardBody';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import Grid from '@mui/material/Grid';

type Props = {};

const deposits = [
  {
    amount: 15000,
    unlocksOn: '2023-04-06T00:00:00.000Z',
    rewards: 75000,
    percentOfRewards: 0.7
  },
  {
    amount: 5000,
    unlocksOn: '2022-06-06T00:00:00.000Z',
    rewards: 55000,
    percentOfRewards: 0.25
  }
];

const MyLockdropDepositsHeader: FC<Props> = () => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      direction="row">
      <Grid item>Amount Locked</Grid>
      <Grid item>Fully Unlocks On</Grid>
      <Grid item>Est. Lockdrop Rewards</Grid>
      <Grid item>Est. % of Lockdrop Rewards</Grid>
      <Grid item>Actions</Grid>
    </Grid>
  );
};

export default MyLockdropDepositsHeader;
