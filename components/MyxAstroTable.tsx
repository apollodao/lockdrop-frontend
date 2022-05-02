import React, { FC, ReactNode } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import ApolloCardHeader from './ApolloCardHeader';
import MyLockdropDepositsHeader from './MyLockdropDepositsHeader';
import MyxAstroTableRow from './MyxAstroTableRow';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import MyxAstroTableHeader from './MyxAstroTableHeader';
import WidgetContainer from './WidgetContainer';
import Stack from '@mui/material/Stack';
import { white60 } from '../theme/mui-theme';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// todo - replace with svg
import MyxAstroEmptyTableRow from './MyxAstroEmptyTableRow';
import { addressState } from '../data/wallet';
import { useRecoilValue } from 'recoil';

type Props = {};

const MyxAstroTable: FC<Props> = ({}) => {
  const userWalletAddr = useRecoilValue(addressState);
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));

  return (
    <WidgetContainer
      title="My xASTRO"
      titleFontVariant="body2"
      padding={0}
      linkText="Get xASTRO"
      linkUrl="https://app.astroport.fi/governance"
      style={{ width: '100%' }}>
      <Stack>
        {!isMobile && <MyxAstroTableHeader />}
        {userWalletAddr ? (
          <MyxAstroTableRow />
        ) : (
          <MyxAstroEmptyTableRow msg="You need to connect your wallet" />
        )}
      </Stack>
    </WidgetContainer>
  );
};

export default MyxAstroTable;
