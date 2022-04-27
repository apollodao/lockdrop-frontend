import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  almostAlmostWhite,
  almostWhite,
  borderWhite,
  darkGrey
} from '../theme/mui-theme';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import Link from '@mui/material/Link';

export type Props = {
  children: any;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  mb?: number | string;
  borderRadius?: number;
  style?: {};
  title?: string;
  linkUrl?: string;
  linkText?: string;
  titleRenderer?: any;
  titleFontVariant?:
    | 'inherit'
    | 'button'
    | 'overline'
    | 'caption'
    | 'h5'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | undefined;
  onClose?: () => void;
};

const useStyles: any = makeStyles((theme: Theme) => ({
  customHoverFocus: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#454545 !important' }
  }
}));

const WidgetContainer = ({
  children,
  width = 100,
  height = 'auto',
  padding = 3,
  borderRadius = 4,
  title,
  linkUrl,
  linkText,
  titleRenderer = null,
  titleFontVariant = 'h5',
  style,
  mb,
  onClose
}: Props) => {
  const classes = useStyles();

  return (
    <Box
      sx={{
        width: width,
        height: height,
        backgroundColor: darkGrey,
        borderRadius: borderRadius,
        p: padding,
        mb: mb,
        ...style
      }}>
      {(title || titleRenderer) && (
        <Stack>
          <Stack
            padding={3}
            direction="row"
            alignItems="center"
            justifyContent="space-between">
            {title && (
              <Typography
                variant={titleFontVariant}
                color={almostAlmostWhite}
                component="div">
                <strong>{title}</strong>
              </Typography>
            )}
            {titleRenderer}
            {onClose && (
              <IconButton
                className={classes.customHoverFocus}
                onClick={onClose}>
                <CloseIcon
                  sx={{ fontSize: 13, color: almostWhite, cursor: 'pointer' }}
                />
              </IconButton>
            )}
            {linkUrl && (
              <div>
                <Link color={almostWhite}>{linkText}</Link>
                <IconButton
                  className={classes.customHoverFocus}
                  onClick={onClose}>
                  <ExternalLinkIcon
                    color={almostWhite}
                    sx={{ fontSize: 13, color: almostWhite, cursor: 'pointer' }}
                  />
                </IconButton>
              </div>
            )}
          </Stack>
          <Divider />
        </Stack>
      )}
      {children}
    </Box>
  );
};

export default WidgetContainer;
