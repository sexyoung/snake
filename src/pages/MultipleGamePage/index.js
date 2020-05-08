import React from 'react';

import { NAV } from 'consts';

export function MultipleGamePage({ send }) {
  return (
    <div>
      MultipleGamePage
      <button onClick={() => send(NAV.GO_MENU)}>menu</button>
    </div>
  );
}
