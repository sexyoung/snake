import React from 'react';

import { NAV } from 'consts';

export function MenuPage({ send }) {
  return (
    <div>
      <button onClick={() => send(NAV.GO_SINGLE)}>single</button>
      <button onClick={() => send(NAV.GO_MULTIPLE)}>multiple</button>
      <button onClick={() => send(NAV.GO_ABOUT)}>about</button>
    </div>
  );
}
