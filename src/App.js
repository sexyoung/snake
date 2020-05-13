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

import { isRoute, toStr } from 'utils';

export default function App() {
  const [state, send] = useMachine(appMachine, { devTools: true });
  state.at = route => isRoute(state.value, route);
  state.str = (abs = false) => toStr(state.value, abs);
  state.inMeta = message => isRoute(state.meta, message);
  
  console.log(state.value);
  

  return (
    <>
      {state.matches(STATUS.SCREEN.MENU) && <MenuPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.ABOUT) && <AboutPage {...{ send }} />}
      {state.matches(STATUS.SCREEN.SINGLE) && <SingleGamePage {...{ state, send }} />}
      {state.matches(STATUS.SCREEN.MULTIPLE) && <MultipleGamePage {...{ state, send }} />}
    </>
  );
}
