import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const primaryMain = '#0052cc';
const bgDefault = '#05080D';
const bgPaper = 'rgba(255, 255, 255, 0.07)';
const secondaryMain = '#edf2ff';
const textPrimary = 'rgba(255, 255, 255, 0.85)';
const textSecondary = 'rgba(255, 255, 255, 0.5)';
const divider = 'rgba(255, 255, 255, 0.2)';

// colors from safe app
export const transparentGold = 'rgba(254,210,0,0.90)';
export const orangeGoldGradientVert = 'linear-gradient(#fed200 0%, #fd806d 100%)';
export const orangeGoldGradientHorz = 'linear-gradient(90deg, #fd806d 0%, #fed200 100%)';
export const orangeGoldGradientHorz50 = 'linear-gradient(90deg, #fd806d66 0%, #fed20066 100%)';
export const transparentGreen = 'rgba(74,218,74,0.90)';
export const almostBlack = 'rgba(5,8,13,1.0)'; // body bg

export const buttonGrey = '#292B30';
export const darkGrey = '#181b1f';

export const darkBlue = 'rgba(28,41,62,1.0)';
export const white = 'rgba(255,255,255,1.0)';
export const white5 = 'rgba(255,255,255,0.05)';
export const white60 = 'rgba(255,255,255,0.6)';
export const white95 = 'rgba(255,255,255,0.85)';
export const popOverBlue = 'rgba(7,10,15,1.0)';
export const borderWhite = 'rgba(255,255,255,0.20)';
export const red = '#d32f2f';
export const borderGrey = '#30363e';
export const gold = '#FED200';
export const gold50 = 'rgba(254,210,0,0.5)';
export const peach = '#FD806D';
export const peach50 = 'rgba(253,128,109,0.5)';

// breakpoints
const xl = 1920;
const lg = 1200;
const md = 968;
const sm = 720;
const xs = 0;

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: primaryMain,
      },
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      secondary: {
        main: secondaryMain,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider: divider,
    },
    breakpoints: {
      values: {
        xl,
        lg,
        md,
        sm,
        xs,
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontSize: 64,
        fontWeight: 'bold',
        lineHeight: 1,
        '@media (max-width:720px)': {
          fontSize: 30,
        },
      },
      h2: {
        fontSize: 50,
        fontWeight: 'bold',
        lineHeight: 1.32,
        '@media (max-width:720px)': {
          fontSize: 24,
        },
      },
      h3: {
        fontSize: 45,
        fontWeight: 600,
        lineHeight: 1.6,
        '@media (max-width:720px)': {
          fontSize: 24,
        },
      },
      h4: {
        fontSize: 42,
        fontWeight: 'bold',
        lineHeight: 1.33,
        '@media (max-width:720px)': {
          fontSize: 24,
        },
      },
      h5: {
        fontSize: 26,
        fontWeight: 'bold',
        lineHeight: 1.2,
        '@media (max-width:720px)': {
          fontSize: 18,
        },
      },
      h6: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 1.3,
        '@media (max-width:720px)': {
          fontSize: 16,
        },
      },
      subtitle1: {
        fontFamily: '\'Obviously\',sans-serif',
        fontSize: 14,
        fontWeight: 500,
        color: white95,
        lineHeight: '22px',
        '@media (max-width:720px)': {
          fontSize: 12,
        },
      },
      subtitle2: {
        fontFamily: '\'Inter\',sans-serif',
        fontSize: 20,
        lineHeight: 1.25,
        '@media (max-width:720px)': {
          fontSize: 15,
        },
      },
      body1: {
        fontFamily: '\'Inter\',sans-serif',
        fontSize: 14,
        lineHeight: '20px',
        '@media (max-width:720px)': {
          fontSize: 12,
        },
      },
      body2: {
        fontFamily: '\'Inter\',sans-serif',
        fontSize: 16,
        lineHeight: 1.25,
        '@media (max-width:720px)': {
          fontSize: 13,
        },
      },
      caption: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.33,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 15,
            height: 40,
            fontSize: 16,
            fontFamily: '\'Inter\',sans-serif',
            textTransform: 'unset',
            padding: '0 12px',
            fontWeight: 600,
          },
          outlined: {
            border: `1px solid ${textPrimary}`,
            color: textPrimary,
            '&:hover': {
              border: `1px solid ${textPrimary}`,
            },
          },
          contained: {
            background: textPrimary,
            color: bgDefault,
            '&:hover': {
              background: textPrimary,
            },
          },
        },
      },
    },
  })
);
