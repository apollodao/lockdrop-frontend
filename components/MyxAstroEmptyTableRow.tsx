import React, { FC, useEffect, useState, useCallback } from 'react';
import ApolloCardHeader from './ApolloCardHeader';
import ApolloCardBody from './ApolloCardBody';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import Grid from '@mui/material/Grid';
import {
  white95,
  borderGrey,
  white5
} from '../theme/mui-theme';
import Typography from '@mui/material/Typography';

type Props = {
  msg: string;
};

const MyxAstroEmptyTableRow: FC<Props> = ({ msg }: Props) => {
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
      <Grid item md={12} container direction="row" justifyContent="flex-start">
        <Typography sx={{ fontSize: '15px', fontWeight: 500 }} color={white95}>
          {msg}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MyxAstroEmptyTableRow;
