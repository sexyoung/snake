import { Machine } from 'xstate';
import {
  SCREEN,
  GO_MENU,
  GO_ABOUT,
  GO_SINGLE,
  GO_MULTIPLE,
} from 'consts';

export const screenMachine = Machine({
  id: 'screenMachine',
  initial: SCREEN.MENU,
  states: {
    [SCREEN.MENU]: {
      on: {
        [GO_ABOUT]:    SCREEN.ABOUT,
        [GO_SINGLE]:   SCREEN.SINGLE,
        [GO_MULTIPLE]: SCREEN.MULTIPLE,
      }
    },
    [SCREEN.ABOUT]: {
      on: {
        [GO_MENU]: SCREEN.MENU,
      }
    },
    [SCREEN.SINGLE]: {
      on: {
        [GO_MENU]: SCREEN.MENU,
      }
    },
    [SCREEN.MULTIPLE]: {
      on: {
        [GO_MENU]: SCREEN.MENU,
      }
    },
  }
});