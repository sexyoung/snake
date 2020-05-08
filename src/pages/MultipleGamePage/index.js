import React from 'react';

import { ACTION } from 'consts';

export function MultipleGamePage({ send }) {
  return (
    <div>
      <h3>MultipleGamePage</h3>
      <button onClick={() => send(ACTION.NAV.GO_MENU)}>menu</button>
    </div>
  );
}
