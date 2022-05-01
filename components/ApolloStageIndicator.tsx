import React, { FC, ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import {
  almostBlack,
  white60,
  gold50,
  peach,
  peach50,
  gold,
  darkGrey
} from '../theme/mui-theme';
import Grid from '@mui/material/Grid';
import { useLockdrop } from 'hooks/useLockdrop';

type Props = {
  borderColor?: string;
  children?: ReactNode;
  isRight?: boolean;
};

const useStyles: any = makeStyles((theme: Theme) => ({
  countdownText: {}
}));

const ApolloStageIndicator: FC<Props> = ({ borderColor = darkGrey }) => {
  const classes = useStyles();

  const { lockdropConfig } = useLockdrop();
  const currentDate = new Date();

  const isToday = (i) => {
    return (
      currentDate.getTime() >
        lockdropConfig.startDate.getTime() + i * 24 * 60 * 60 * 1000 &&
      currentDate.getTime() <
        lockdropConfig.startDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000
    );
  };

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        direction="row"
        columns={7}
        sx={{ padding: '3px 2px' }}
        textAlign="center">
        <Grid
          item
          md={5}
          sx={{
            borderBottom: '3px solid',
            borderBottomColor: gold,
            padding: '4px 0'
          }}>
          <Typography variant="subtitle1" color="textPrimary">
            STAGE 1
          </Typography>
        </Grid>
        <Grid
          item
          md={2}
          sx={{
            // border: '3px solid ' + almostBlack,
            borderBottom: '3px solid',
            borderBottomColor: peach,
            padding: '4px'
          }}>
          <Typography variant="subtitle1" color="textPrimary">
            STAGE 2
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        columns={7}
        sx={{ padding: '0' }}
        spacing={0}>
        {new Array(7).fill(0).map((_, i) => {
          if (isToday(i)) {
            return (
              <Grid
                item
                key={'cell-' + i}
                md={1}
                xs={1}
                textAlign={'center'}
                sx={{
                  background: 'white',
                  fontWeight: 'bold',
                  border: '2px solid',
                  padding: '3px 0',
                  borderColor: borderColor
                }}>
                <Typography
                  variant="body2"
                  color={almostBlack}
                  sx={{ fontSize: '12px', lineHeight: '16px' }}>
                  TODAY
                </Typography>
              </Grid>
            );
          } else if (i < 5) {
            return (
              <Grid
                item
                key={'cell-' + i}
                md={1}
                xs={1}
                textAlign={'center'}
                sx={{
                  background: gold50,
                  fontWeight: 'bold',
                  border: '2px solid',
                  padding: '3px 0',
                  borderColor: borderColor
                }}>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  sx={{ fontSize: '12px', lineHeight: '16px' }}>
                  {i + 1}
                </Typography>
              </Grid>
            );
          } else {
            return (
              <Grid
                item
                key={'cell-' + i}
                md={1}
                xs={1}
                textAlign={'center'}
                sx={{
                  background: peach50,
                  fontWeight: 'bold',
                  border: '2px solid',
                  padding: '3px 0',
                  borderColor: borderColor
                }}>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  sx={{ fontSize: '12px', lineHeight: '16px' }}>
                  {i + 1}
                </Typography>
              </Grid>
            );
          }
        })}
      </Grid>
      <Grid
        item
        container
        direction="row"
        sx={{ padding: '4px 2px' }}
        columns={7}>
        <Grid item md={5} xs={5} textAlign="left" sx={{ whiteSpace: 'nowrap' }}>
          <Typography
            variant="body2"
            color={white60}
            sx={{ fontSize: '12px', lineHeight: '16px' }}>
            {new Date(lockdropConfig.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC'
            })}
          </Typography>
        </Grid>
        <Grid
          item
          md={2}
          xs={2}
          textAlign="right"
          sx={{ whiteSpace: 'nowrap' }}>
          <Typography
            variant="body2"
            color={white60}
            sx={{ fontSize: '12px', lineHeight: '16px' }}>
            {new Date(lockdropConfig.endDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ApolloStageIndicator;
