import {
  STATUS,
  ACTION,
} from 'consts';

export default {
  id: 'singleMachine',
  initial: STATUS.GAME.READY,
  states: {
    [STATUS.GAME.READY]: {
      on: {
        [ACTION.GAME.PLAY]:    STATUS.GAME.PLAYING,
        [ACTION.NAV.GO_SINGLE]:   SCREEN.SINGLE,
      }
    },
    [STATUS.GAME.PLAYING]: {
      on: {
        [ACTION.NAV.GO_MENU]: SCREEN.MENU,
      }
    },
    [STATUS.GAME.PAUSE]: {
      on: {
        [ACTION.NAV.GO_MENU]: SCREEN.MENU,
      }
    },
    [STATUS.GAME.GAMEOVER]: {
      on: {
        [ACTION.NAV.GO_MENU]: STATUS.GAME.READY,
        [ACTION.NAV.GO_MENU]: SCREEN.MENU,
      }
    },
  }
};
