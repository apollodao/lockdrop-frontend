import React, { FC } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';
import Modal from 'components/modals/MuiModal';
import CloseIcon from 'components/icons/CloseIcon';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const LockSuccessModal: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal width={420} isOpen={isOpen} onClose={onClose}>
      <Box className="panel" padding="16px">
        <Box display="flex" justifyContent="space-between">
          <h4 className="color-green">Deposit Successful</h4>
          <Button variant="icon" mr="-2" onClick={onClose}>
            <CloseIcon color="white" width="1.5rem" height="1.5rem" />
          </Button>
        </Box>
        <Box mt="20px">
          <p className="color-secondary">You've locked</p>
        </Box>
        <Box
          mt="12px"
          px="12px"
          py="8px"
          className="panel1"
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <Box display="flex" alignItems="center">
            <Image src="/xastro.png" alt="astro" width={30} />
            <Box ml="6px">
              <h5 className="color-primary">xASTRO</h5>
            </Box>
          </Box>
          <Box textAlign="right">
            <h2 className="color-primary">1,250</h2>
            <small className="color-secondary">$4,375.00</small>
          </Box>
        </Box>
        <Box mt="20px">
          <p className="color-secondary">Breakdown</p>
        </Box>
        <Box
          mt="12px"
          px="12px"
          py="8px"
          className="panel1"
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <h5 className="color-primary">Duration</h5>
          <Box textAlign="right">
            <Box display="flex" alignItems="center">
              <h2 className="color-primary">3</h2>
              <Box ml="6px">
                <h5 className="color-secondary">MONTHS</h5>
              </Box>
            </Box>
            <small className="color-secondary">August 1, 2022</small>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default LockSuccessModal;
