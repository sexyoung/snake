import React from 'react';
import { useMachine } from '@xstate/react';

import * as ACTION from 'consts';
import { getMachine, useXState } from 'hooks';
import { screenMachine } from 'stateNodes/Screen';

export function MenuPage() {
  const s = getMachine(screenMachine);
  const ss = useXState(s);
  return (
    <div>
      <button
        onClick={() => {
          ss.send(ACTION.GO_ABOUT);
        }}
      >
        About
      </button>
    </div>
  );
}
