import React, { FC, useState } from 'react';
import {
  chakra,
  Box,
  HStack,
  Link,
  Button,
  Text,
  VStack
} from '@chakra-ui/react';
import { Checkbox } from '@mui/material';
import NextLink from 'next/link';

import WalletPopover from 'components/WalletPopover';
import TerraIcon from 'components/icons/TerraIcon';
import { white95, almostBlack, gold, buttonGrey } from '../../theme/mui-theme';

type Props = {
  onClick: () => void;
};

const WalletDisclaimerPopover: FC<Props> = ({ onClick }) => {
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  return (
    <WalletPopover
      offset={[20, 0]}
      triggerElement={() => (
        <chakra.button
          type="button"
          color="white"
          _focus={{
            outline: 'none',
            boxShadow: 'none'
          }}
          _hover={{
            bg: 'brand.purple'
          }}
          bg="brand.lightBlue"
          py="2"
          px="4"
          borderRadius="full">
          <HStack spacing="3">
            <TerraIcon width="1.25rem" height="1.25rem" />
            <Text>Connect your wallet</Text>
          </HStack>
        </chakra.button>
      )}>
      <Box maxWidth="500px" p="12px" pt="20px" className="panel">
        <Box display="flex" alignItems="flex-start">
          <Box mt="-8px" mr="6px">
            <Checkbox
              color="secondary"
              checked={disclaimerChecked}
              onChange={(e) =>
                setDisclaimerChecked(e.target.checked)
              }></Checkbox>
          </Box>
          <p className="color-primary">
            I acknowledge and agree that the Site solely provides information
            about data on the Terra blockchain. I accept that the Site operators
            have no custody over my funds, ability or duty to transact on my
            behalf or power to reverse my transactions. The Site operators do
            not endorse or provide any warranty with respect to any tokens.
          </p>
        </Box>
        <Box mt="12px" textAlign="right">
          <Button
            maxWidth={156}
            width="100%"
            borderRadius={15}
            height={45}
            fontSize={13}
            fontFamily="Obviously, sans-serif"
            onClick={onClick}
            isDisabled={!disclaimerChecked}
            backgroundColor={gold}
            color={almostBlack}
            backgroundHoverColor={buttonGrey}
            hoverColor={white95}>
            Accept
          </Button>
        </Box>
      </Box>
      <VStack spacing="3"></VStack>
    </WalletPopover>
  );
};

export default WalletDisclaimerPopover;
