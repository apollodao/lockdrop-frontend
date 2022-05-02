import React, { FC } from 'react';
import { Box, Modal } from '@mui/material';
import styles from './Modals.module.scss';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
};

const MuiModal: FC<Props> = ({ isOpen, onClose, width = 540.5, children }) => {
  return (
    <Modal
      BackdropProps={{
        classes: {
          root: styles.backDrop
        }
      }}
      open={isOpen}
      onClose={onClose}>
      <Box maxWidth={width} className={styles.modalWrapper}>
        <Box className={styles.modalContent}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default MuiModal;
