import React from 'react';
import { useMachine } from '@xstate/react';

import { STATUS } from 'consts';
import { appMachine } from  'stateNodes';

import {
  MenuPage,
  AboutPage,
  SingleGamePage,
  MultipleGamePage,
} from './pages';

import { matchPath } from 'utils';

export default function App() {
  const [state, send] = useMachine(appMachine, { devTools: true });

  console.log(matchPath(state.value, STATUS.GAME.READY));
  

  return (
    <>
      {state.matches(STATUS.SCREEN.MENU) && <MenuPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.ABOUT) && <AboutPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.SINGLE) && <SingleGamePage {...{ state, send }} />}
      {state.matches(STATUS.SCREEN.MULTIPLE) && <MultipleGamePage {...{ state, send }} />}
    </>
  );
}
