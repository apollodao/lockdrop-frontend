import { atom } from 'recoil';

export type SnackBarTypes = {
  open: true | false;
  severity: 'success' | 'error';
  message: any;
  link?: string;
};

export const snackBarState = atom({
  key: 'snackBar',
  default: {
    open: false,
    severity: 'success',
    message: '',
    link: ''
  } as SnackBarTypes
});
