import { Machine } from 'xstate';
import {
  NAV,
  SCREEN,
} from 'consts';

export const appMachine = Machine({
  id: 'appMachine',
  initial: SCREEN.MENU,
  states: {
    [SCREEN.MENU]: {
      on: {
        [NAV.GO_ABOUT]:    SCREEN.ABOUT,
        [NAV.GO_SINGLE]:   SCREEN.SINGLE,
        [NAV.GO_MULTIPLE]: SCREEN.MULTIPLE,
      }
    },
    [SCREEN.ABOUT]: {
      on: {
        [NAV.GO_MENU]: SCREEN.MENU,
      }
    },
    [SCREEN.SINGLE]: {
      on: {
        [NAV.GO_MENU]: SCREEN.MENU,
      }
    },
    [SCREEN.MULTIPLE]: {
      on: {
        [NAV.GO_MENU]: SCREEN.MENU,
      }
    },
  }
});