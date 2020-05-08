import React from 'react';
import { useMachine } from '@xstate/react';

import { SCREEN } from 'consts';
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
      {state.matches(SCREEN.MENU) && <MenuPage {...{ send }} />}
      {state.matches(SCREEN.ABOUT) && <AboutPage {...{ send }} />}
      {state.matches(SCREEN.SINGLE) && <SingleGamePage {...{ send }} />}
      {state.matches(SCREEN.MULTIPLE) && <MultipleGamePage {...{ send }} />}
    </>
  );
}
