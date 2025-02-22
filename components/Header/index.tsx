import React from 'react';
import { useTheme, useMediaQuery, Drawer } from '@mui/material';
import {
  Flex,
  HStack,
  Image,
  Button,
  useDisclosure,
  VStack,
  Box,
  Link
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import TerraWallet from 'components/TerraWallet';
import BurgerIcon from 'components/icons/BurgerIcon';
import CloseIcon from 'components/icons/CloseIcon';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const menuItems = [
    {
      text: 'Information',
      link: '/'
    },
    {
      text: 'Lockdrop',
      link: '/active-phase'
    }
  ];

  const router = useRouter();

  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Box className={styles.header}>
      <Box display="flex" alignItems="center">
        <Image
          onClick={() => {
            window.open(`https://apollo.farm`, '_blank');
          }}
          style={{ cursor: 'pointer' }}
          src="/logo-apollo.svg"
          alt="Apollo Logo"
        />
        <Box display="flex" ml={1.5}>
          {menuItems.map((item, index) => (
            <Box
              className={`${item.link === router.pathname && styles.active} ${
                styles.menuItem
              }`}
              key={index}>
              {item.link ? (
                <NextLink href={item.link} passHref>
                  <p>{item.text}</p>
                </NextLink>
              ) : (
                <p>{item.text}</p>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <HStack spacing="5" justify="flex-end">
        {isMobile ? (
          <Button variant="icon" ref={btnRef} onClick={onOpen} pr="0" mr="-2">
            <BurgerIcon color="white" width="1.5rem" height="1.5rem" />
          </Button>
        ) : (
          <TerraWallet />
        )}
      </HStack>
      <Drawer anchor="left" open={isOpen} onClose={onClose}>
        <Flex
          className="panel"
          height="100%"
          padding="16px"
          direction="column"
          style={{ width: isMobile ? '100vw' : 500 }}>
          <Flex justify="space-between" width="100%" align="center">
            <Box flexShrink={0}>
              <Image src="/logo-apollo.svg" alt="Apollo DAO" />
            </Box>
            <Button variant="icon" mr="-2" onClick={onClose}>
              <CloseIcon color="white" width="1.5rem" height="1.5rem" />
            </Button>
          </Flex>
          <Box mt="20">
            <VStack spacing="4" align="flex-start" textTransform="uppercase">
              <p className="color-secondary">xASTRO Lockdrop</p>
              <Link href="/" color="white">
                <h5>Information</h5>
              </Link>
              <Link href="/active-phase" color="white">
                <h5>Lockdrop</h5>
              </Link>
            </VStack>
          </Box>
          <VStack spacing="10" align="flex-start" mt="auto">
            <TerraWallet />
            <HStack spacing="12" align="flex-start" display="none">
              <Link
                href="https://astroport.fi/terms-and-conditions"
                textTransform="uppercase"
                color="white"
                opacity="0.7"
                isExternal>
                Terms of use
              </Link>
            </HStack>
          </VStack>
        </Flex>
      </Drawer>
    </Box>
  );
};

export default Header;
