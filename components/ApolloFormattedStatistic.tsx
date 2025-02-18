/* eslint-disable no-ternary */
import React, { FC, ReactNode } from 'react';
import CountUp from 'react-countup';
import { Box, BoxProps } from '@chakra-ui/react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { white60, white95 } from '../theme/mui-theme';

type Props = {
  value: number;
  decimals?: number;
  fontSize?: string;
  postFix?: string;
  percentage?: boolean;
  decimalsInGrey?: boolean;
};

const useStyles: any = makeStyles((theme: Theme) => ({
  standard: {
    color: white95
  },
  lighter: {
    color: white60
  },
  smaller: {
    fontSize: '1.0rem',
    fontWeight: 'normal'
  }
}));

const ApolloFormattedStatistic: FC<Props> = ({
  value = 0,
  decimals = 0,
  fontSize = '1.0rem',
  postFix = '',
  percentage = false,
  decimalsInGrey = false
}) => {
  const classes = useStyles();
  return (
    <div className={classes.standard}>
      <CountUp
        style={{ fontSize, marginRight: postFix ? '8px' : 0 }}
        end={value}
        separator=","
        decimals={decimals}
        duration={1}
        suffix={percentage ? '%' : ''}
      />
      {/* <span style={{ fontSize: fontSize, marginRight: '8px' }}>
        {Math.trunc(value).toLocaleString('en-US')}
        {decimals > 0 && (
          <span className={decimalsInGrey ? `${classes.lighter}` : ''}>
            {'.' + value.toFixed(decimals).toString().split('.')[1]}
          </span>
        )}
        {percentage && '%'}
      </span> */}
      <span className={`${classes.lighter} ${classes.smaller}`}>{postFix}</span>
    </div>
  );
};

export default ApolloFormattedStatistic;
