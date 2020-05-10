import {
  STATUS,
  ACTION,
} from 'consts';

/** 用 #來指定絕對位置 */
const MENU = `#navMachine.${STATUS.SCREEN.MENU}`;

export default {
  id: 'singleMachine',
  initial: STATUS.GAME.READY,
  // type: 'compound',
  states: {
    [STATUS.GAME.READY]: {
      on: {
        [ACTION.NAV.GO_MENU]: MENU,
        [ACTION.GAME.PLAY]: STATUS.GAME.PLAYING,
      }
    },
    [STATUS.GAME.PLAYING]: {
      on: {
        // [ACTION.NAV.GO_MENU]: MENU,
      }
    },
    [STATUS.GAME.PAUSE]: {
      on: {
        [ACTION.NAV.GO_MENU]: MENU,
      }
    },
    [STATUS.GAME.GAMEOVER]: {
      on: {
        [ACTION.NAV.GO_MENU]: STATUS.GAME.READY,
        [ACTION.NAV.GO_MENU]: MENU,
      }
    },
  }
};
