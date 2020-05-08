import React from 'react';

import { ACTION } from 'consts';

export function AboutPage({ send }) {
  return (
    <div>
      <h3>AboutPage</h3>
      <button onClick={() => send(ACTION.NAV.GO_MENU)}>menu</button>
    </div>
  );
}
