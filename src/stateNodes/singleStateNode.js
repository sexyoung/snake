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
        [ACTION.GAME.PAUSE]: STATUS.GAME.PAUSE,
        [ACTION.GAME.OVER]: STATUS.GAME.GAMEOVER,
      },
      meta: {
        message: 'IN_GAME'
      }
    },
    [STATUS.GAME.PAUSE]: {
      on: {
        [ACTION.NAV.GO_MENU]: MENU,
        [ACTION.GAME.PLAY]: STATUS.GAME.PLAYING,
      },
      meta: {
        message: 'IN_GAME',
        snakeMoving: 'SNAKE_STOP',
      }
    },
    [STATUS.GAME.GAMEOVER]: {
      on: {
        [ACTION.GAME.READY]: STATUS.GAME.READY,
        [ACTION.NAV.GO_MENU]: MENU,
      },
      meta: {
        snakeMoving: 'SNAKE_STOP',
      },
    },
  }
};
