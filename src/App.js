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

export default function App() {
  const [state, send] = useMachine(appMachine, { devTools: true });
  
  return (
    <>
      {state.matches(STATUS.SCREEN.MENU) && <MenuPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.ABOUT) && <AboutPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.SINGLE) && <SingleGamePage {...{ send }} />}
      {state.matches(STATUS.SCREEN.MULTIPLE) && <MultipleGamePage {...{ send }} />}
    </>
  );
}
