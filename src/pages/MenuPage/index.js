import React from 'react';

import { ACTION } from 'consts';

export function MenuPage({ send }) {
  return (
    <div>
      <button onClick={() => send(ACTION.NAV.GO_SINGLE)}>single</button>
      <button onClick={() => send(ACTION.NAV.GO_MULTIPLE)}>multiple</button>
      <button onClick={() => send(ACTION.NAV.GO_ABOUT)}>about</button>
    </div>
  );
}
