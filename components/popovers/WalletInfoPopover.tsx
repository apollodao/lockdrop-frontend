import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useTheme, useMediaQuery } from '@mui/material';
import copy from 'copy-to-clipboard';
import {
  Box,
  chakra,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  useToast,
  Button,
  Text,
  VStack
} from '@chakra-ui/react';
import { fromTerraAmount, useAddress, useBalance } from '@arthuryeti/terra';
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider';

import { truncate } from 'libs/text';
import { useTokenInfo } from 'modules/common';
import useFinder from 'hooks/useFinder';

import WalletPopover from 'components/WalletPopover';
import TerraIcon from 'components/icons/TerraIcon';
import CopyIcon from 'components/icons/CopyIcon';
import ViewIcon from 'components/icons/ViewIcon';
import CloseIcon from 'components/icons/CloseIcon';
import { white95, almostBlack, gold, buttonGrey } from '../../theme/mui-theme';

const WalletInfoPopover: FC = () => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const { getIcon, getSymbol } = useTokenInfo();
  const { disconnect } = useWallet();
  const wallet = useConnectedWallet();
  const toast = useToast();
  const icon = getIcon('uusd');
  const symbol = getSymbol('uusd');
  const balance = useBalance('uusd');
  const terraAddress = useAddress();
  const finder = useFinder();
  const router = useRouter();

  const copyAddress = () => {
    copy(terraAddress);
    toast({
      title: 'Address copied',
      description: 'Your Terra address is now in your clipboard',
      status: 'info',
      duration: 2000,
      isClosable: false
    });
  };

  const handleDisconnect = () => {
    const pathname = router.pathname;
    if (
      router.pathname.includes('/lock') ||
      router.pathname.includes('/unlock')
    ) {
      router.push('/active-phase');
    }
    disconnect();
  };

  return (
    <WalletPopover
      offset={[20, 0]}
      triggerElement={() => (
        <chakra.button type="button">
          <Flex color="white" spacing="0.5" justify="center">
            <HStack spacing="3">
              <TerraIcon width="16px" height="16px" />
              <Text fontSize="sm" color="white">
                {wallet && truncate(wallet.terraAddress)}
              </Text>
            </HStack>
            <Center
              color="white"
              bg="brand.lightBlue"
              py="2"
              px="3"
              borderTopRightRadius="full"
              borderBottomRightRadius="full">
              <HStack spacing="3">
                <Text fontSize="sm" color="white">
                  UST
                </Text>
                <Text fontSize="sm" color="white">
                  {fromTerraAmount(balance, '0,0.00')}
                </Text>
              </HStack>
            </Center>
          </Flex>
        </chakra.button>
      )}>
      <Box
        maxWidth={isMobile ? '100vw' : '500px'}
        p="12px"
        pt="20px"
        className="panel">
        <Box mb="16px">
          <h3 className="color-primary">In my wallet</h3>
        </Box>
        <Flex flex={1} justify="space-between" align="center" py="2">
          <Box display="flex" alignItems="center">
            <Image width="24px" src={icon} alt="" />
            <Box ml="8px">
              <h3 className="color-primary">{symbol}</h3>
              <p className="color-secondary">Terra</p>
            </Box>
          </Box>
          <Flex direction="column">
            <HStack flex={1} justify="space-between">
              <p className="color-secondary">In Wallet: </p>
              <p className="color-primary">$ {fromTerraAmount(balance)}</p>
            </HStack>
            {/* <HStack justify="space-between">
                <Text flex={1} textStyle="small" variant="dimmed">
                  Price:{" "}
                </Text>
                <Text textStyle="small" variant="dimmed">
                  {fromTerraAmount(price)}
                </Text>
              </HStack> */}
          </Flex>
        </Flex>
        <VStack my="12px" align="flex-start">
          <h5 className="color-primary weight-600">My Address</h5>
          <Text className="color-secondary" textStyle="small" variant="dimmed">
            {truncate(terraAddress, [16, 16])}
          </Text>
        </VStack>
        <Flex justify="space-between">
          <chakra.button onClick={copyAddress}>
            <HStack>
              <CopyIcon width="1.5rem" height="1.5rem" fill="white" />
              <Text
                className="color-primary"
                textStyle="small"
                variant="dimmed">
                Copy Address
              </Text>
            </HStack>
          </chakra.button>
          <Link isExternal href={finder(terraAddress)}>
            <HStack ml="8px">
              <ViewIcon width="1.5rem" height="1.5rem" fill="white" />
              <Text
                className="color-primary"
                textStyle="small"
                variant="dimmed">
                View on Terra Finder
              </Text>
            </HStack>
          </Link>
        </Flex>
        <Box mt="12px" textAlign="right">
          <Button
            maxWidth={156}
            width="100%"
            borderRadius={15}
            height={45}
            fontSize={13}
            fontFamily="Obviously, sans-serif"
            backgroundColor={gold}
            onClick={handleDisconnect}>
            Disconnect
          </Button>
        </Box>
      </Box>
    </WalletPopover>
  );
};

export default WalletInfoPopover;
