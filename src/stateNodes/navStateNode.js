import {
  ACTION,
  STATUS,
} from 'consts';

import SINGLE_STATE_NODE from './singleStateNode';

export default {
  id: 'navMachine',
  initial: STATUS.SCREEN.SINGLE,
  states: {
    [STATUS.SCREEN.MENU]: {
      on: {
        [ACTION.NAV.GO_ABOUT]:    STATUS.SCREEN.ABOUT,
        [ACTION.NAV.GO_SINGLE]:   STATUS.SCREEN.SINGLE,
        [ACTION.NAV.GO_MULTIPLE]: STATUS.SCREEN.MULTIPLE,
      }
    },
    [STATUS.SCREEN.ABOUT]: {
      on: {
        [ACTION.NAV.GO_MENU]: STATUS.SCREEN.MENU,
      }
    },
    [STATUS.SCREEN.SINGLE]: SINGLE_STATE_NODE,
    [STATUS.SCREEN.MULTIPLE]: {
      on: {
        [ACTION.NAV.GO_MENU]: STATUS.SCREEN.MENU,
      }
    },
  }
};
