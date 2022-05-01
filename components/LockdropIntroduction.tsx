import React from 'react';
import { Box, Grid, useTheme, useMediaQuery, Typography } from '@mui/material';
import { Image } from '@chakra-ui/react';
import ApolloCountdown from './ApolloCountdown';
import { white95 } from '../theme/mui-theme';
import ApolloDAOTextLogo from './icons/ApolloDAOTextLogo';

const LockdropIntroduction = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  return (
    <Box>
      <Box
        position="relative"
        zIndex={-1}
        borderRadius="15px"
        overflow="hidden">
        <Image src="/hero_image_background.png" alt="lockdrop background" />
        <Box position="absolute" bottom={0}>
          <Image src="/hero_image_characters.png" alt="lockdrop banner" />
        </Box>
      </Box>
      <Grid container spacing={4} my={4}>
        <Grid item textAlign={isMobile ? 'center' : 'left'} xs={12} sm={6}>
          <Box
            display="flex"
            justifyContent={isMobile ? 'center' : 'flex-start'}
            mb={1}>
            <ApolloDAOTextLogo />
          </Box>
          <Typography
            sx={{
              fontFamily: 'Obviously, sans-serif',
              fontSize: '30px',
              lineHeight: '37px',
              fontWeight: '500',
              color: white95
            }}>
            xASTRO Lockdrop
          </Typography>
        </Grid>
        <Grid
          item
          container
          justifyContent={isMobile ? 'center' : 'flex-end'}
          xs={12}
          sm={6}>
          <Box textAlign="center">
            <ApolloCountdown />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LockdropIntroduction;
