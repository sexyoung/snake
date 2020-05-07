import React from 'react';
import { useMachine } from '@xstate/react';

import { SCREEN } from 'consts';
import { getMachine, useXState } from 'hooks';
import { screenMachine } from  'stateNodes/Screen';

import {
  MenuPage,
  AboutPage,
  SingleGamePage,
  MultipleGamePage,
} from './pages';

export default function App() {
  const s = getMachine(screenMachine);
  const ss = useXState(s);
  // console.warn(s, state);
  
  return (
    <>
      {ss.state.matches(SCREEN.MENU) && <MenuPage />}
      {ss.state.matches(SCREEN.ABOUT) && <AboutPage />}
      {ss.state.matches(SCREEN.SINGLE) && <SingleGamePage />}
      {ss.state.matches(SCREEN.MULTIPLE) && <MultipleGamePage />}
    </>
  );
}
