import { Machine } from 'xstate';
import { SCREEN_STATES } from 'consts/Status';

export const SnakeMachine = Machine({
  id: 'SnakeMachine',
  initial: SCREEN_STATES.MENU,
  states: {
    [SCREEN_STATES.MENU]: {
      on: {
        'GO_ABOUT': SCREEN_STATES.ABOUT,
        'GO_SINGLE': SCREEN_STATES.SINGLE,
        'GO_MULTIPLE': SCREEN_STATES.MULTIPLE,
      }
    },
    [SCREEN_STATES.ABOUT]: {
      on: {
        'GO_MENU': SCREEN_STATES.MENU,
      }
    },
    [SCREEN_STATES.SINGLE]: {
      on: {
        'GO_MENU': SCREEN_STATES.MENU,
      }
    },
    [SCREEN_STATES.MULTIPLE]: {
      on: {
        'GO_MENU': SCREEN_STATES.MENU,
      }
    },
  }
});