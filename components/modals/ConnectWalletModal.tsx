import React, { FC } from 'react';
import { useWallet, ConnectType } from '@terra-money/wallet-provider';
import { Box, Text, HStack, Flex, chakra } from '@chakra-ui/react';
import Modal from 'components/modals/MuiModal';
import TerraExtensionIcon from 'components/icons/TerraExtensionIcon';
import TerraMobileIcon from 'components/icons/TerraMobileIcon';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ConnectWalletModal: FC<Props> = ({ isOpen, onClose }) => {
  const { connect } = useWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box className="panel" padding="16px">
        <Flex
          direction="column"
          justify="center"
          align="center"
          textAlign="center">
          <chakra.button
            transition="0.2s all"
            p="6"
            borderRadius="xl"
            color="white"
            width="100%"
            mb="4"
            _hover={{
              color: 'brand.dark'
            }}
            onClick={() => {
              onClose();
              connect(ConnectType.EXTENSION);
            }}>
            <HStack justify="space-between">
              <Text>Terra Station Extension</Text>
              <TerraExtensionIcon />
            </HStack>
          </chakra.button>
          <chakra.button
            transition="0.2s all"
            p="6"
            borderRadius="xl"
            color="white"
            width="100%"
            _hover={{
              color: 'brand.dark'
            }}
            onClick={() => {
              onClose();
              connect(ConnectType.WALLETCONNECT);
            }}>
            <HStack justify="space-between">
              <Text>Terra Station Mobile</Text>
              <TerraMobileIcon width="1.5rem" height="1.5rem" />
            </HStack>
          </chakra.button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default ConnectWalletModal;
