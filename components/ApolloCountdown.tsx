import React, { FC, ReactNode, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Countdown from 'react-countdown';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { orangeGoldGradientHorz } from '../theme/mui-theme';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { lockdropConfig } from '../data/lockdropConfig';
import { useRecoilValue } from 'recoil';

type Props = {
  children?: ReactNode;
  isRight?: boolean;
};

const useStyles: any = makeStyles((theme: Theme) => ({
  countdownText: {
    fontSize: '30px',
    letterSpacing: '0.1rem',
    fontWeight: 500,
    textAlign: 'center',
    background: orangeGoldGradientHorz,
    lineHeight: '1.25em',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  countdownLabel: {
    marginTop: '5px',
    background: 'none #828486',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': '#828282',
    fontSize: '9px',
    textAlign: 'center',
    lineHeight: '1.25em'
  }
}));

const ApolloCountdown: FC<Props> = ({}) => {
  const classes = useStyles();
  const config = useRecoilValue(lockdropConfig);
  const [countdownDate, setCountdownDate] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    (async () => {
      switch (config.currentStage) {
        case 'pre':
          setCountdownDate(config.startDate);
          setTitle('LOCKDROP BEGINS IN');
          break;
        case 'stage1':
          setCountdownDate(config.phases[1].startDate);
          setTitle('STAGE 2 BEGINS IN');
          break;
        case 'stage2':
          setCountdownDate(config.endDate);
          setTitle('STAGE 2 ENDS IN');
          break;
        case 'post':
          setCountdownDate(config.endDate);
          setTitle('LOCKDROP HAS ENDED');
          break;
        default:
          setTitle('INVALID STAGE');
          break;
      }
    })();
  }, [config]);

  return (
    <>
      <Box mb={1}>
        <h6
          title={config && config.stage}
          className="color-primary obviouslyFont">
          {title}
        </h6>
      </Box>
      {countdownDate && (
        <Countdown
          date={countdownDate}
          renderer={(props) => (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="bottom"
              spacing={0.5}
              className={classes.countdownText}>
              <Grid item>
                <div>{props.days.toString().padStart(2, '0')}</div>
                <div className={classes.countdownLabel}>DAYS</div>
              </Grid>
              <Grid item>:</Grid>
              <Grid item>
                <div>{props.hours.toString().padStart(2, '0')}</div>
                <div className={classes.countdownLabel}>HOURS</div>
              </Grid>
              <Grid item>:</Grid>
              <Grid item>
                <div>{props.minutes.toString().padStart(2, '0')}</div>
                <div className={classes.countdownLabel}>MINUTES</div>
              </Grid>
              <Grid item>:</Grid>
              <Grid item>
                <div>{props.seconds.toString().padStart(2, '0')}</div>
                <div className={classes.countdownLabel}>SECONDS</div>
              </Grid>
            </Grid>
          )}
        />
      )}
    </>
  );
};

export default ApolloCountdown;
